import {yellow} from '@mui/material/colors';
import {t} from 'i18n-js';
import _ from 'lodash';
import moment, {Moment} from 'moment';
import {CSSProperties} from 'react';
import {light_gray, primary_green, red} from '../styles/colors';
// import {
//   addTrainingDataQuery,
//   specificTrainingDataQuery,
// } from "../logic/firestore";
import {AthleteTagType} from '../traindoo_shared/types/User';

export const generateYearWeekNumber = (momentString: Moment): number => {
  if (moment(momentString).week() < 10) {
    return Number(
      `${moment(momentString).year()}0${moment().subtract(7, 'month').week()}`,
    );
  } else {
    return Number(
      `${moment(momentString).year()}${moment().subtract(7, 'month').week()}`,
    );
  }
};

export const objectRemoveUndefined = (inputObj: any) => {
  const editObj = _.cloneDeep(inputObj);
  for (const [key, value] of Object.entries(editObj)) {
    if (typeof value === 'object') {
      editObj[key] = objectRemoveUndefined(value);
    } else if (!value) {
      delete editObj[key];
    }
  }
  return editObj;
};

export const calculateCalories = (
  carbsString: string,
  fatsString: string,
  proteinsString: string,
  valueString: string,
  questionIndex: number,
) => {
  const valueNumber = parseFloat(valueString);
  let carbs = parseFloat(carbsString);
  let fats = parseFloat(fatsString);
  let proteins = parseFloat(proteinsString);
  switch (questionIndex) {
    case 1:
      carbs = !isNaN(valueNumber) ? valueNumber : 0;
      break;
    case 2:
      proteins = !isNaN(valueNumber) ? valueNumber : 0;
      break;
    case 3:
      fats = !isNaN(valueNumber) ? valueNumber : 0;
      break;
    default:
      break;
  }
  carbs = !isNaN(carbs) ? carbs : 0;
  fats = !isNaN(fats) ? fats : 0;
  proteins = !isNaN(proteins) ? proteins : 0;
  return 4.1 * carbs + 4.1 * proteins + fats * 9.3;
};

export const calculate1RM = (
  load: number | string,
  reps: number,
  rpe: number,
  useRir: boolean,
) => {
  rpe = rpe.toString() === '-1' || isNaN(rpe) ? (useRir ? 0 : 10) : rpe;
  if (load <= 0 || reps <= 0) {
    return -1;
  } else {
    load = parseFloat(load.toString());
    reps = parseFloat(reps.toString());
    let returnValue = 0;
    if (useRir) {
      returnValue = 0.033 * (reps + 10 - (10 - rpe)) * load + load;
    } else {
      returnValue = 0.033 * (reps + 10 - rpe) * load + load;
    }

    return isNaN(returnValue) ? -1 : returnValue;
  }
};

export const getWeekdayArray = () => {
  return [
    t('MONDAY'),
    t('TUESDAY'),
    t('WEDNESDAY'),
    t('THURSDAY'),
    t('FRIDAY'),
    t('SATURDAY'),
    t('SUNDAY'),
  ];
};

export const getWeekdayForIndex = (index: number): string => {
  if (Number.isInteger(index) && index < 7 && index >= 0) {
    return getWeekdayArray()[index];
  } else {
    return getWeekdayArray()[0];
  }
};

export const getIndexForWeekday = (weekdayName: string): number => {
  const index = getWeekdayArray().findIndex(
    (element) => element === weekdayName,
  );
  if (index !== -1) {
    return index;
  } else {
    return 0;
  }
};

export const indexToStringEx = (index: number): string => {
  return 'exercise' + index;
};

export const indexToStringSet = (index: number): string => {
  return 'set' + index;
};

export const handleValues = (value: string | number, empty?: boolean) => {
  const char = empty ? '' : '-';
  if (typeof value === 'string') {
    if (!value || value === '-1' || parseFloat(value) < 1) {
      return char;
    } else {
      return value;
    }
  } else if (typeof value === 'number') {
    if (value < 1) {
      return char;
    } else {
      return value;
    }
  } else {
    return char;
  }
};

export const getYouTubeId = (
  url: string,
): {isYouTube: boolean; youTubeUrl: string} => {
  const regExp =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return {isYouTube: true, youTubeUrl: match[2]};
  } else {
    return {isYouTube: false, youTubeUrl: ''};
  }
};

export const valueIsGiven = (value: string) => {
  if (value === undefined) {
    return false;
  } else {
    const valueNumber = parseFloat(value);
    if (isNaN(valueNumber)) {
      if (value === '') {
        return false;
      }
    } else {
      if (valueNumber < 0) {
        return false;
      }
    }
  }
  return true;
};

export const getStandardTags = () => {
  return {
    noPlan: {
      title: t('ATHLETES_INDICATOR_DESCRIPTION_ERROR'),
      style: {backgroundColor: red} as unknown as CSSProperties,
      date: '',
    },
    warningPlan: {
      title: t('ATHLETES_INDICATOR_DESCRIPTION_WARNING'),
      style: {backgroundColor: yellow[700]} as CSSProperties,
      date: '',
    },
    planAvailable: {
      title: t('ATHLETES_INDICATOR_DESCRIPTION_PLANNED'),
      style: {backgroundColor: primary_green} as CSSProperties,
      date: '',
    },
    newAthlete: {
      title: t('ATHLETES_CARD_NEW_ATHLETE_TITLE'),
      style: {backgroundColor: light_gray} as CSSProperties,
      date: '',
    },
  };
};
export const getAthleteStandardTag = (
  lastPlanStartDate: string,
): AthleteTagType => {
  const standardTags = getStandardTags();
  if (lastPlanStartDate) {
    const trainingEndDate = moment(lastPlanStartDate)
      .add(6, 'days')
      .startOf('day');
    const diffLastPlan = trainingEndDate?.diff(moment().startOf('day'), 'days');

    if (diffLastPlan < 0) {
      return standardTags.noPlan;
    } else if (diffLastPlan <= 1) {
      return standardTags.warningPlan;
    } else {
      return standardTags.planAvailable;
    }
  } else {
    return standardTags.newAthlete;
  }
};

export function capitalizeFirstLetter(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export const generateUppercaseAlphabet = () => {
  const alphabet = [];
  for (let i = 65; i <= 90; i++) {
    alphabet.push(String.fromCharCode(i));
  }
  return alphabet;
};
export const calculateLoadFromPrimaryExercise = (
  primaryExerciseValue: number,
  percentageValue: string,
  oneRMRoundTarget: number,
) => {
  const result =
    Math.floor(
      Math.ceil(
        (primaryExerciseValue * parseFloat(percentageValue)) /
          100 /
          oneRMRoundTarget,
      ) *
        oneRMRoundTarget *
        100,
    ) / 100;

  return isNaN(result) ? '' : result.toString();
};
