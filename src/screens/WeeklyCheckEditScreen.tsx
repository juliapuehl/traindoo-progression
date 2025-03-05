import {CSSProperties} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useFirestore, useFirestoreConnect} from 'react-redux-firebase';
import {CheckEditor} from '../components/CheckEditor';
import {
  getUserId,
  getWeeklyCheckArray,
  getWeeklyCheckTemplate,
  specificWeeklyCheckTemplateQuery,
} from '../logic/firestore';
import {
  getSelectedWeeklyCheckTemplateId,
  setSelectedWeeklyCheckTemplateId,
} from '../store/checkEditorSlice';
import {background_color_dark} from '../styles/colors';
import {CheckTemplateType} from '../types/Check';
import {deleteDailyCheck} from '../utils/editingCheckHelper';

export const WeeklyCheckEditScreen = () => {
  Intercom('update', {
    vertical_padding: 20,
  });

  const userId = useSelector(getUserId);
  const checkId = useSelector(getSelectedWeeklyCheckTemplateId);
  const checkArray = useSelector(getWeeklyCheckArray);
  const dispatch = useDispatch();
  const firestore = useFirestore();

  useFirestoreConnect(
    userId && checkId
      ? [specificWeeklyCheckTemplateQuery(userId, checkId)]
      : [],
  );

  const handleDelete = (id: string, name: string) => {
    deleteDailyCheck(name, id, userId, firestore, 'weekly');
    dispatch(setSelectedWeeklyCheckTemplateId(checkArray[0].id));
  };
  const setSelectedCheckId = (newValue: string) => {
    dispatch(setSelectedWeeklyCheckTemplateId(newValue));
  };
  const check = useSelector(getWeeklyCheckTemplate) as CheckTemplateType;
  return (
    <div style={styles.main}>
      <CheckEditor
        handleDelete={handleDelete}
        checkId={checkId}
        checkArray={checkArray}
        setSelectedCheckId={setSelectedCheckId}
        type="weekly"
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
