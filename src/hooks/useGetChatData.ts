import {t} from 'i18n-js';
import moment from 'moment';
import {useSelector} from 'react-redux';
import {ChatOverviewContact} from '../components/chat/ChatOverviewContactsListItem';
import {
  getAllActiveAthletes,
  getUserDocumentVersion,
  getUserId,
} from '../logic/firestore';
import {useGetActiveAthletes} from '../traindoo_shared/hooks/useGetActiveAthletes';
import {getChats} from '../traindoo_shared/selectors/chatSelectors';
import {UserType} from '../traindoo_shared/types/User';

export const useGetChatData = (searchBarInput: string) => {
  const chats = useSelector(getChats);
  const userId = useSelector(getUserId);
  const isUpdatedUser = useSelector(getUserDocumentVersion) > 0;
  const athletesOld: UserType[] = useSelector(getAllActiveAthletes);
  const athletesNew: UserType[] = useGetActiveAthletes(userId);
  // After updating the athlete state logic we use athletesNew
  // TODO: remove athletesOld after all users have updated their athlete state
  const athletes = isUpdatedUser ? athletesNew : athletesOld;

  // Filter athletes by search bar input
  const athletesFilteredBySearchInput: UserType[] = athletes?.filter(
    (element) =>
      (
        element?.firstName.replaceAll(' ', '').toLowerCase() +
        element?.lastName.replaceAll(' ', '').toLowerCase()
      ).includes(searchBarInput.replaceAll(' ', '').toLowerCase()),
  );

  const chatContacts: ChatOverviewContact[] = athletesFilteredBySearchInput
    ?.map((athlete) => {
      // scenario: trainer has not chatted with selected athlete before -->
      // athlete has no entry in lastChat document yet
      const selfChat = userId === athlete.id;
      const athleteChat = chats
        ? Object.values(chats)?.find((chat) => {
            if (selfChat) {
              // Check if participantIds only contains the userId
              const participantsSet = new Set(chat.participantIds);
              return participantsSet.size === 1 && participantsSet.has(userId);
            } else {
              return (
                chat.participantIds.includes(athlete.id) &&
                chat.chatType === 'private'
              );
            }
          })
        : undefined;

      const lastMessage = athleteChat?.lastMessage;
      return {
        lastMessageText: lastMessage?.contentText ?? t('CHAT_NEW_CONVERSATION'),
        sentAt: lastMessage?.sentAt,
        seen: !lastMessage?.unseen?.includes(userId) ?? true,
        firstName: athlete?.firstName ?? '',
        lastName: athlete?.lastName ?? '',
        profilePicture: athlete?.athlete?.profilePicture ?? '',
        id: athlete?.id ?? '',
      };
    })
    // Sort by last message time
    .sort((contactA, contactB) => {
      /* Handle case that sentAt is empty str, since moment('') returns null.
       * Moment's diff returns NaN when one of the inputs is null.
       * null is an invalid input for sort's compareFcn. */
      const momentA = moment(contactA.sentAt ?? 0);
      const momentB = moment(contactB.sentAt ?? 0);
      return momentB.diff(momentA);
    });

  return {chatContacts, athletesFilteredBySearchInput};
};
