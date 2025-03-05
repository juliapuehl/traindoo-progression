import {useSelector} from 'react-redux';
import {RootState} from '../../store/store';
import {getExerciseUseRir} from '../../store/trainingSlice';
import {useTrackingSession} from '../progressionFeature/model/useTrackingSession';
import {useSetConnect} from './model/set/useSetConnect';
import {SetButton} from './SetButton';
import {SetInputContainer} from './SetInputContainer';

type Props = {
  selectedSet: number;
  exerciseIndex: number;
  setIndex: number;
  setSelectedSet: (newIndex: number) => void;
};

export const Set = ({
  selectedSet,
  setSelectedSet,
  exerciseIndex,
  setIndex,
}: Props) => {
  const {registerUserActivity} = useTrackingSession();
  const {set, updateSet} = useSetConnect(exerciseIndex, setIndex);
  const useRir = useSelector((state: RootState) =>
    getExerciseUseRir(state, exerciseIndex),
  );
  const handleClick = () => {
    setSelectedSet(setIndex);
  };
  const changeValue = (key: string, value: any) => {
    registerUserActivity('modified existing ' + key, String(value));
    updateSet(key, value);
  };

  return (
    <>
      <span
        onClick={handleClick}
        className="flex items-center justify-center h-6 text-white"
      >
        {setIndex + 1}
      </span>

      <SetInputContainer
        key={'loadInput' + exerciseIndex}
        valueKey={'load'}
        set={set}
        onClick={handleClick}
        onBlur={changeValue}
        exerciseIndex={exerciseIndex}
        useRir={useRir}
      />
      <SetInputContainer
        key={'repsInput' + exerciseIndex}
        valueKey={'reps'}
        set={set}
        onClick={handleClick}
        onBlur={changeValue}
        useRir={useRir}
      />
      <SetInputContainer
        key={'rpeInput'}
        valueKey={'rpe'}
        set={set}
        onClick={handleClick}
        onBlur={changeValue}
        useRir={useRir}
      />
      <SetButton
        setIndex={setIndex}
        selectedSet={selectedSet}
        setSelectedSet={setSelectedSet}
        videoRequired={set?.trainer?.videoRequired}
        updateValue={changeValue}
        exerciseIndex={exerciseIndex}
      />
    </>
  );
};
