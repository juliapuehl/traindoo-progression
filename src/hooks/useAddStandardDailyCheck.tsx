import firebase from 'firebase/app';
import {Dispatch, useEffect, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ExtendedFirestoreInstance, useFirestore} from 'react-redux-firebase';
import {
  addDailyCheckQuery,
  addWeeklyCheckQuery,
  checkCategoryLibraryQuery,
  getAthleteIds,
  getCheckCategoryLibrary,
  getPublicUserProfile,
  getRegistrationFlags,
  getUser,
  specificDailyCheckTemplateQuery,
  specificWeeklyCheckTemplateQuery,
  usersDataPublicProfileQuery,
  usersDataQuery,
  webSettingsLayoutQuery,
} from '../logic/firestore';
import {
  setSelectedDailyCheckTemplateId,
  setSelectedWeeklyCheckTemplateId,
} from '../store/checkEditorSlice';
import {standardCheckCategoryLibrary} from '../traindoo_shared/types/Check';
import {useGetUnitValueBackend} from '../traindoo_shared/units/useUnits';
import {standardDailyCheckTemplate} from '../types/DefaultDailyCheck';
import {standardWeeklyCheckTemplate} from '../types/DefaultWeeklyCheck';
import {defaultDashboardLayout} from '../utils/DefaultDashboardLayout';
import {
  fixBrokenProgressImages,
  generateOldChecks,
} from '../utils/editingCheckHelper';

export const useAddStandardDailyCheck = async () => {
  const user = useSelector(getUser);
  const publicUser = useSelector(getPublicUserProfile);
  const firestore = useFirestore();
  const dispatch = useDispatch();
  const block = useRef(false);
  const blockProgress = useRef(false);
  const blockAdjustSoreness = useRef(false);
  const athleteIds = useSelector(getAthleteIds);
  const getValueBackend = useGetUnitValueBackend();
  const registrationFlags = useSelector(getRegistrationFlags);
  const categoryLibrary = useSelector(getCheckCategoryLibrary);
  useEffect(() => {
    const func = async () => {
      try {
        generateStandardChecks(firestore, user.id, dispatch);
        await generateOldChecks(
          athleteIds,
          firestore,
          standardCheckCategoryLibrary,
          getValueBackend,
        );
        firestore.update(usersDataQuery(user.id), {
          ['trainer.updateFlags.progressImages']: true,
        });
      } catch (error) {
        console.log(error);
      }
    };
    const fixProgressImages = async () => {
      try {
        await fixBrokenProgressImages(athleteIds, firestore);
        firestore.update(usersDataQuery(user.id), {
          ['trainer.updateFlags.progressImages']: true,
        });
      } catch (error) {
        console.log(error);
      }
    };
    if (
      user &&
      publicUser &&
      publicUser?.trainer?.dailyCheckInfo?.standardDailyCheckId === undefined &&
      !block.current &&
      athleteIds !== undefined &&
      registrationFlags?.registrationCompleted === true
    ) {
      block.current = true;
      func();
    } else if (
      user &&
      publicUser &&
      athleteIds !== undefined &&
      !blockProgress.current &&
      registrationFlags?.registrationCompleted === true &&
      user?.trainer?.updateFlags?.progressImages !== true
    ) {
      blockProgress.current = true;
      fixProgressImages();
    } else if (
      user &&
      publicUser &&
      categoryLibrary &&
      athleteIds !== undefined &&
      !blockAdjustSoreness.current &&
      registrationFlags?.registrationCompleted === true &&
      categoryLibrary?.Regeneration?.questions?.SorenessScore?.answers?.[0].includes(
        'SURVEY_VERY_BAD',
      )
    ) {
      // Adjust text for soreness score
      //TODO: remove this after a while -> 15.11.2022
      blockAdjustSoreness.current = true;
      firestore.update(checkCategoryLibraryQuery(user.id), {
        ['Regeneration.questions.SorenessScore.answers']: [
          'SURVEY_SORENESS_VERY_GOOD',
          'SURVEY_SORENESS_GOOD',
          'SURVEY_SORENESS_OK',
          'SURVEY_SORENESS_BAD',
          'SURVEY_SORENESS_VERY_BAD',
        ],
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicUser, user, athleteIds]);
};

export const generateStandardChecks = async (
  firestore: ExtendedFirestoreInstance,
  userId: string,
  dispatch: Dispatch<any>,
) => {
  const dailyDoc = await firestore.add(
    addDailyCheckQuery(userId),
    standardDailyCheckTemplate,
  );
  firestore.set(
    specificDailyCheckTemplateQuery(userId, dailyDoc.id),
    {id: dailyDoc.id},
    {merge: true},
  );
  const weeklyDoc = await firestore.add(
    addWeeklyCheckQuery(userId),
    standardWeeklyCheckTemplate,
  );
  firestore.set(
    specificWeeklyCheckTemplateQuery(userId, weeklyDoc.id),
    {id: weeklyDoc.id},
    {merge: true},
  );
  firestore.set(
    webSettingsLayoutQuery(userId),
    {dailyCheckLayout: defaultDashboardLayout()},
    {merge: true},
  );
  firestore.set(
    usersDataPublicProfileQuery(userId),
    {
      trainer: {
        dailyCheckInfo: {
          dailyCheckArray: firebase.firestore.FieldValue.arrayUnion({
            id: dailyDoc.id,
            name: standardDailyCheckTemplate.name,
          }),
          standardDailyCheckId: dailyDoc.id,
        },
        weeklyCheckInfo: {
          weeklyCheckArray: firebase.firestore.FieldValue.arrayUnion({
            id: weeklyDoc.id,
            name: standardWeeklyCheckTemplate.name,
          }),
          standardWeeklyCheckId: weeklyDoc.id,
        },
      },
    },
    {merge: true},
  );
  firestore.set(
    checkCategoryLibraryQuery(userId),
    standardCheckCategoryLibrary,
    {
      merge: true,
    },
  );
  dispatch(setSelectedDailyCheckTemplateId(dailyDoc.id));
  dispatch(setSelectedWeeklyCheckTemplateId(weeklyDoc.id));
};
