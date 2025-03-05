import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {
  getCurrentAthleteId,
  getCurrentAthleteOneRMCycleSetting,
  getCurrentAthletePercentageRoundTarget,
} from '../../../store/athleteSlice';
import {RootState} from '../../../store/store';
import {
  getExerciseUsePrimaryExercise,
  getPrimaryExerciseValue,
  getSelectedDayIndex,
  getSelectedTrainingId,
} from '../../../store/trainingSlice';
import {SetTypeTrainer} from '../../../traindoo_shared/types/Training';
import {useCalculateLoadBackend} from '../../../traindoo_shared/units/useCalculateLoadBackend';
import {useCalculateLoadFrontend} from '../../../traindoo_shared/units/useCalculateLoadFrontend';
import {editExercise, editValue} from '../../../utils/editingTrainingHelper';
import {
  calculateLoadFromPrimaryExercise,
  valueIsGiven,
} from '../../../utils/helper';

const determineLoadType = (
  setTrainer: SetTypeTrainer,
  usePrimary?: boolean,
  useOneRM?: any,
  useCycleType?: boolean,
) => {
  if (usePrimary && useCycleType) return 'cycle';
  if (
    valueIsGiven(setTrainer?.percentOneRm) ||
    setTrainer?.usePercentOneRm ||
    useOneRM
  )
    return 'rm';
  else return 'load';
};

export const useLoadType = (
  rerender: boolean,
  setIndex: number,
  exerciseIndex: number,
  setData: SetTypeTrainer,
  onChange: (key: string, value: any) => void,
  onBlur: (key: string, value: any) => void,
  addSetMode: boolean,
  useOneRM?: boolean,
) => {
  const firestore = useFirestore();

  const trainingId = useSelector(getSelectedTrainingId);
  const athleteUserId = useSelector(getCurrentAthleteId);
  const dayIndex = useSelector(getSelectedDayIndex);
  const useCycleType = useSelector((state: RootState) =>
    getCurrentAthleteOneRMCycleSetting(state),
  );
  const calculateLoadBackend = useCalculateLoadBackend();
  const calculateLoadFrontend = useCalculateLoadFrontend();

  const usePrimaryExercise = useSelector((state: RootState) =>
    getExerciseUsePrimaryExercise(state, exerciseIndex),
  );
  const primaryExerciseValue = useSelector((state: RootState) =>
    getPrimaryExerciseValue(state, exerciseIndex),
  );
  const oneRMRoundTarget = useSelector((state: RootState) =>
    getCurrentAthletePercentageRoundTarget(state),
  );

  const [primaryValue, setPrimaryValue] = useState<string>();
  const [secondaryValue, setSecondaryValue] = useState<string>();
  const [loadType, setLoadType] = useState<'cycle' | 'rm' | 'load'>(
    determineLoadType(setData, usePrimaryExercise, useOneRM, useCycleType),
  );
  useEffect(() => {
    setLoadType(
      determineLoadType(setData, usePrimaryExercise, useOneRM, useCycleType),
    );
  }, [setData, usePrimaryExercise, useOneRM, useCycleType]);
  useEffect(() => {
    if (loadType === 'cycle') {
      setPrimaryValue(
        valueIsGiven(setData?.trainerPercentage?.toString())
          ? setData?.trainerPercentage?.toString()
          : '',
      );
      setSecondaryValue(
        valueIsGiven(setData?.load)
          ? calculateLoadFrontend(setData?.load)?.toString()
          : '',
      );
    } else if (loadType === 'rm') {
      setPrimaryValue(
        valueIsGiven(setData?.percentOneRm)
          ? (parseFloat(setData?.percentOneRm) * 100)?.toString()
          : '',
      );
    } else {
      setPrimaryValue(
        valueIsGiven(setData?.load)
          ? calculateLoadFrontend(setData?.load)?.toString()
          : '',
      );
    }
  }, [setData, loadType, calculateLoadFrontend, rerender]);

  const changeExercise = (key: string, value: any) => {
    editExercise(
      key,
      value,
      trainingId,
      dayIndex,
      exerciseIndex,
      athleteUserId,
      firestore,
    );
  };
  const changeSet = (key: string, value: any) => {
    editValue(
      trainingId,
      dayIndex,
      exerciseIndex,
      setIndex,
      key,
      value,
      athleteUserId,
      firestore,
    );
  };
  const switchLoadType = () => {
    setPrimaryValue('');
    setSecondaryValue('');
    if (loadType === 'cycle') {
      const firstSet = setIndex === 0;
      changeExercise('usePercentageCalc', false);
      if (firstSet) {
        setLoadType('load');
      } else {
        setLoadType('rm');
        if (addSetMode && onChange) {
          onChange('usePercentOneRm', true);
        } else {
          changeSet('usePercentOneRm', true);
        }
      }
    } else if (loadType === 'rm') {
      setLoadType('load');
      changeExercise('usePercentageCalc', false);
      if (addSetMode && onChange) {
        onChange('percentOneRm', -1);
        onChange('usePercentOneRm', false);
      } else {
        changeSet('usePercentOneRm', false);
        changeSet('percentOneRm', firestore.FieldValue.delete());
      }
    } else {
      if (useCycleType) {
        setLoadType('cycle');
        changeExercise('usePercentageCalc', true);
      } else {
        setLoadType('rm');
        if (addSetMode && onChange) {
          onChange('usePercentOneRm', true);
        } else {
          changeSet('usePercentOneRm', true);
        }
      }
    }
  };

  const handleChange = (newText: string) => {
    let newValue = newText.replace(/(\r\n|\n|\r)/gm, '');
    newValue = newValue.replace(',', '.');
    if (newText.length > 12) {
      setPrimaryValue(newText.substring(0, 12));
      return;
    }
    if (loadType === 'load') {
      setPrimaryValue(newValue);
      onChange('load', calculateLoadBackend(newValue));
    } else {
      const re = /^[.0-9]+$/;
      if (newValue[0] === '0' && newValue[1] !== undefined) {
        newValue = newValue.substring(1);
      }
      if (newValue[newValue.length - 1] === '%') {
        newValue = newValue.substring(newValue.length - 2);
      }
      if (newValue.length > 6) {
        return;
      }
      if (newValue.slice(-1) === '.' && newValue.split('.').length > 2) {
        return;
      }
      if (parseFloat(newValue) <= 0) {
        newValue = '0';
      }
      if (newValue === '' || re.test(newValue)) {
        setPrimaryValue(newValue);
        const key = loadType === 'cycle' ? 'trainerPercentage' : 'percentOneRm';
        if (loadType === 'rm') {
          newValue = String(parseFloat(newValue) / 100);
        }
        onChange(key, newValue);
        if (loadType === 'cycle') {
          const newLoad = calculateLoadFromPrimaryExercise(
            parseFloat(calculateLoadFrontend(primaryExerciseValue).toString()),
            newValue,
            oneRMRoundTarget,
          );
          onChange('load', calculateLoadBackend(newLoad));
          setSecondaryValue(newLoad);
        }
      }
    }
  };

  const handleBlur = () => {
    if (loadType === 'cycle') {
      onBlur('load', calculateLoadBackend(secondaryValue));
      onBlur('trainerPercentage', primaryValue);
    } else if (loadType === 'rm') {
      onBlur('percentOneRm', parseFloat(primaryValue) / 100);
    } else {
      onBlur('load', calculateLoadBackend(primaryValue));
    }
  };

  const placeholder =
    loadType === 'cycle' ? 'Cycle' : loadType === 'rm' ? 'RM' : 'Load';

  return {
    secondaryValue,
    primaryValue,
    loadType,
    switchLoadType,
    placeholder,
    handleChange,
    handleBlur,
  };
};
