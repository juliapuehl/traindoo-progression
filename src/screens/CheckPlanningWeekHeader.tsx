import {t} from 'i18n-js';
import moment from 'moment';
import {CSSProperties} from 'react';
import {useSelector} from 'react-redux';
import {
  getDailyCheckArray,
  getSpecificTrainingWeeklyCheck,
  getTrainingDailyCheckArray,
  getWeeklyCheckArray,
} from '../logic/firestore';
import {RootState} from '../store/store';
import {
  getSpecificTraining,
  getSpecificTrainingId,
} from '../store/trainingSlice';
import {ultra_light_gray} from '../styles/colors';
import {sharedStyle} from '../styles/sharedStyles';
import {CheckAthleteType} from '../traindoo_shared/types/Check';

type Props = {
  weekIndex: number;
};

export const CheckPlanningWeekHeader = (props: Props) => {
  const trainingPlan = useSelector((state: RootState) =>
    getSpecificTraining(state, props.weekIndex),
  );

  /* DAILY CHECK */

  const trainingId = useSelector((state: RootState) =>
    getSpecificTrainingId(state, props.weekIndex),
  );
  const checkArray = useSelector((state: RootState) =>
    getTrainingDailyCheckArray(state, trainingId),
  ) as CheckAthleteType[];

  const firstDailyCheck = checkArray?.[0];
  const dailyCheckTemplatesArray = useSelector(getDailyCheckArray);
  const dailyCheckName = dailyCheckTemplatesArray.find(
    (element) => element.id === firstDailyCheck?.templateId,
  )?.name;

  /* WEEKLY CHECK */

  const weeklyCheckTemplates = useSelector(getWeeklyCheckArray);
  const weeklyCheck = useSelector((state: RootState) =>
    getSpecificTrainingWeeklyCheck(state, trainingId),
  );

  const weeklyCheckName = weeklyCheckTemplates.find(
    (element) => element.id === weeklyCheck?.templateId,
  )?.name;

  const isValid = (checkName: string): boolean => {
    return checkName && checkName.trim().length > 0;
  };

  const isAtLeastOneCheckNameValid = () => {
    return isValid(dailyCheckName) || isValid(weeklyCheckName);
  };

  const areBothCheckNamesValid = () => {
    return isValid(dailyCheckName) && isValid(weeklyCheckName);
  };

  return (
    <div style={styles.weekHeadline}>
      {t('PLANNING_HEALTH_WEEK_TITLE', {
        index: props.weekIndex + 1,
        date: moment(trainingPlan.startDate).format('L'),
      }) +
        (isAtLeastOneCheckNameValid() ? ' - ' : '') +
        (isValid(dailyCheckName) ? dailyCheckName : '') +
        (areBothCheckNamesValid() ? ' / ' : '') +
        (isValid(weeklyCheckName) ? weeklyCheckName : '')}
    </div>
  );
};

type Styles = {
  weekHeadline: CSSProperties;
};

const styles: Styles = {
  weekHeadline: {
    ...sharedStyle.textStyle.title1,
    color: ultra_light_gray,
    textAlign: 'left',
    paddingLeft: 16,
    paddingTop: 8,
  },
};
