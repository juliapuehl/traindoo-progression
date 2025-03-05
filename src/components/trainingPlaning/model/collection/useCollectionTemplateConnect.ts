import {useState} from 'react';
import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {getUserId, getWeekTemplatesArray} from '../../../../logic/firestore';
import {getCurrentAthleteId} from '../../../../store/athleteSlice';
import {getSelectedTraining} from '../../../../store/trainingSlice';
import {
  createNewWeekTemplate,
  deleteWeekTemplate,
  insertWeekTemplate,
} from '../../../../utils/editingTrainingHelper';

export const useCollectionTemplateConnect = () => {
  const firestore = useFirestore();
  const userId = useSelector(getUserId);

  const athleteId = useSelector(getCurrentAthleteId);
  const weekTraining = useSelector(getSelectedTraining);
  const weekTemplates = useSelector(getWeekTemplatesArray);

  const [pasteTemplateLoading, setPasteLoading] = useState(false);
  const [createTemplateLoading, setCreateLoading] = useState(false);

  const pasteTemplate = async (templateId: string) => {
    setPasteLoading(true);
    try {
      await insertWeekTemplate(
        weekTraining.id,
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
      await createNewWeekTemplate(weekTraining, userId, firestore);
    } catch (e) {
      console.error(e);
    } finally {
      setCreateLoading(false);
    }
  };

  const deleteTemplate = async (templateId: string, templateName: string) => {
    deleteWeekTemplate(templateId, templateName, userId, firestore);
  };

  return {
    deleteTemplate,
    weekTemplates,
    createTemplate,
    createTemplateLoading,
    pasteTemplate,
    pasteTemplateLoading,
  };
};
