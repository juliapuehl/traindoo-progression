import {t} from 'i18n-js';
import {CSSProperties} from 'react';
import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {getAthleteStates, getUnusedTags, getUserId} from '../logic/firestore';
import {RootState} from '../store/store';
import {addTagToAthlete, deleteAthleteTag} from '../utils/editingUserHelper';
import SimpleSelectDelete from './SimpleSelectDelete';

type Props = {
  style?: CSSProperties;
  textFieldStyle?: CSSProperties;
  openNewTag: () => void;
  athleteUserId: string;
};

export const TagSelector = (props: Props) => {
  const firestore = useFirestore();
  const userId = useSelector(getUserId);
  const unusedTags = useSelector((state: RootState) =>
    getUnusedTags(state, props.athleteUserId),
  );
  const athleteStates = useSelector(getAthleteStates);
  const items = [
    {
      label: t('TAG_SELECTOR_ADD'),
      value: t('TAG_SELECTOR_ADD'),
    },
  ];
  unusedTags.forEach((element) => {
    items.push({label: element.title, value: element.title});
  });

  const handleChange = (newTag: string) => {
    if (newTag === t('TAG_SELECTOR_ADD')) {
      props.openNewTag();
    } else {
      const addTag = Object.values(unusedTags).find(
        (element) => element.title === newTag,
      );
      addTagToAthlete(addTag, userId, props.athleteUserId, firestore);
    }
  };
  const handleDelete = (index: number) => {
    // Minus one because of TAG_SELECTOR_ADD
    if (index > 0) {
      const deleteTag = Object.values(unusedTags)[index - 1];
      if (deleteTag) {
        if (deleteTag !== undefined) {
          deleteAthleteTag(deleteTag, userId, athleteStates, firestore);
        }
      }
    }
  };

  return (
    <SimpleSelectDelete
      label={t('TAG_SELECTOR_TITLE')}
      items={items}
      onClick={(value) => handleChange(value)}
      onDelete={(value) => handleDelete(value)}
      native={true}
    />
  );
};
