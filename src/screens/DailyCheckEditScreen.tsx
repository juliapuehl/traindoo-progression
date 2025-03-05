import {CSSProperties} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useFirestore, useFirestoreConnect} from 'react-redux-firebase';
import {CheckEditor} from '../components/CheckEditor';
import {
  getDailyCheckArray,
  getDailyCheckTemplate,
  getUserId,
  specificDailyCheckTemplateQuery,
} from '../logic/firestore';
import {
  getSelectedDailyCheckTemplateId,
  setSelectedDailyCheckTemplateId,
} from '../store/checkEditorSlice';
import {background_color_dark} from '../styles/colors';
import {CheckTemplateType} from '../types/Check';
import {deleteDailyCheck} from '../utils/editingCheckHelper';

export const DailyCheckEditScreen = () => {
  const userId = useSelector(getUserId);
  const checkId = useSelector(getSelectedDailyCheckTemplateId);
  const checkArray = useSelector(getDailyCheckArray);
  const dispatch = useDispatch();
  const firestore = useFirestore();

  useFirestoreConnect(
    userId && checkId ? [specificDailyCheckTemplateQuery(userId, checkId)] : [],
  );

  const handleDelete = (id: string, name: string) => {
    deleteDailyCheck(name, id, userId, firestore, 'daily');
    dispatch(setSelectedDailyCheckTemplateId(checkArray[0].id));
  };
  const setSelectedCheckId = (newValue: string) => {
    dispatch(setSelectedDailyCheckTemplateId(newValue));
  };
  const check = useSelector(getDailyCheckTemplate) as CheckTemplateType;
  return (
    <div style={styles.main}>
      <CheckEditor
        handleDelete={handleDelete}
        checkId={checkId}
        checkArray={checkArray}
        setSelectedCheckId={setSelectedCheckId}
        type="daily"
        check={check}
      />
    </div>
  );
};

type Styles = {
  main: CSSProperties;
};

const styles: Styles = {
  main: {
    backgroundColor: background_color_dark,
    paddingBottom: 200,
  },
};
