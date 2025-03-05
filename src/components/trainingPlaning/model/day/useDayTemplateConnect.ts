import {useState} from 'react';
import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {getDayTemplatesArray, getUserId} from '../../../../logic/firestore';
import {getCurrentAthleteId} from '../../../../store/athleteSlice';
import {
  getSelectedDayIndex,
  getSelectedTrainingId,
  getTrainingDay,
} from '../../../../store/trainingSlice';
import {
  createNewDayTemplate,
  deleteDayTemplate,
  insertDayTemplate,
} from '../../../../utils/editingTrainingHelper';

export const useDayTemplateConnect = () => {
  const firestore = useFirestore();
  const userId = useSelector(getUserId);

  const athleteId = useSelector(getCurrentAthleteId);
  const trainingId = useSelector(getSelectedTrainingId);
  const dayIndex = useSelector(getSelectedDayIndex);
  const dayPlan = useSelector(getTrainingDay);
  const dayTemplates = useSelector(getDayTemplatesArray);

  const [pasteTemplateLoading, setPasteLoading] = useState(false);
  const [createTemplateLoading, setCreateLoading] = useState(false);

  const pasteTemplate = async (templateId: string) => {
    setPasteLoading(true);
    try {
      await insertDayTemplate(
        trainingId,
        dayIndex,
        templateId,
        userId,
        athleteId,
        firestore,
      );
    } catch (e) {
      console.error(e);
    } finally {
      setPasteLoading(false);
    }
  };

  const createTemplate = async () => {
    setCreateLoading(true);
    try {
      await createNewDayTemplate(
        dayPlan,
        dayPlan.name ?? '',
        userId,
        firestore,
      );
    } catch (e) {
      console.error(e);
    } finally {
      setCreateLoading(false);
    }
  };

  const deleteTemplate = async (templateId: string, templateName: string) => {
    deleteDayTemplate(templateId, templateName, userId, firestore);
  };

  return {
    deleteTemplate,
    templateOverview: dayTemplates,
    createTemplate,
    createTemplateLoading,
    pasteTemplate,
    pasteTemplateLoading,
  };
};
