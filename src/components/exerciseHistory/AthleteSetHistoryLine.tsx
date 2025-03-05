import {VideoCameraIcon} from '@heroicons/react/24/outline';
import {cloneDeep} from 'lodash';
import {Fragment, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import {useFirestore} from 'react-redux-firebase';
import {twMerge} from 'tailwind-merge';
import {useIsOverflowHorizontal} from '../../hooks/useIsOverflowHorizontal';
import {specificTrainingDataQuery} from '../../logic/firestore';
import {getCurrentAthleteId} from '../../store/athleteSlice';
import {
  SetSplitterType,
  dayIndicesArray,
} from '../../traindoo_shared/types/Training';
import {useCalculateLoadBackend} from '../../traindoo_shared/units/useCalculateLoadBackend';
import {useCalculateLoadFrontend} from '../../traindoo_shared/units/useCalculateLoadFrontend';
import {calculate1RM, valueIsGiven} from '../../utils/helper';
import {NotePopover} from '../NotePopover';
import {IconButton} from '../tailwind/buttons/IconButton';
import {AthleteSetHistoryItem} from './AthleteSetHistoryItem';
import {ExerciseHistoryContainer} from './model/useExerciseHistoryOptionsConnect';

type Props = {
  set: SetSplitterType;
  useRir: boolean;
  exercisePaths: ExerciseHistoryContainer;
};

export const AthleteSetHistoryLine = ({set, exercisePaths, useRir}: Props) => {
  const calculateLoadFrontend = useCalculateLoadFrontend();
  const calculateLoadBackend = useCalculateLoadBackend();
  const athleteUserId = useSelector(getCurrentAthleteId);
  const firestore = useFirestore();
  const hasVideo = Boolean(set.athlete?.video);
  const handleVideoClick = (link: string) => {
    const win = window.open(link, '_blank');
    win.focus();
  };
  const [showPopOver, setShowPopOver] = useState(false);
  const noteRef = useRef();
  const isOverflow = useIsOverflowHorizontal(noteRef, exercisePaths?.date);

  const onBlur = (key: string, value: any) => {
    const newSet = cloneDeep(set);
    newSet.athlete[key] = value;
    const oneRm = calculate1RM(
      newSet.athlete.load,
      newSet.athlete.reps,
      newSet.athlete.rpe,
      useRir,
    );
    newSet.athlete.oneRm = oneRm;
    const path =
      'trainingDays.' +
      dayIndicesArray[exercisePaths.dayIndex] +
      '.exercises.exercise' +
      exercisePaths.exerciseIndex +
      '.sets.' +
      'set' +
      set.index;
    firestore.update(
      specificTrainingDataQuery(athleteUserId, exercisePaths.trainingId),
      {[path]: newSet},
    );
  };

  return (
    <Fragment key={set.index}>
      <div className="flex justify-center overflow-hidden text-white">
        {set.index + 1}
      </div>
      <AthleteSetHistoryItem
        value={calculateLoadFrontend(set.athlete?.load)}
        onBlur={(value: string) => onBlur('load', calculateLoadBackend(value))}
      />
      <AthleteSetHistoryItem
        value={set.athlete?.reps}
        onBlur={(value: string) => onBlur('reps', value)}
      />
      <AthleteSetHistoryItem
        value={set.athlete?.rpe}
        onBlur={(value: string) => onBlur('rpe', value)}
      />
      <div className="flex justify-center overflow-hidden text-white">
        {valueIsGiven(String(set.athlete?.oneRm))
          ? calculateLoadFrontend(Math.round(set.athlete?.oneRm * 10) / 10)
          : '-'}
      </div>

      <div className="flex   space-x-2">
        <IconButton
          icon={VideoCameraIcon}
          size="sm"
          disabled={!hasVideo}
          className={twMerge(
            hasVideo &&
              'bg-gray-300 rounded-full text-highlight-500 hover:bg-gray-200 hover:shadow-inner  active:bg-gray-300',
          )}
          onClick={() => handleVideoClick(set.athlete?.video)}
        />

        {set.athlete?.note ? (
          <div
            ref={noteRef}
            key={set.index}
            className={twMerge(
              'whitespace-nowrap overflow-auto text-white',
              isOverflow &&
                'bg-light_gray rounded-full px-2 truncate hover:bg-gray-100 hover:shadow-inner active:bg-gray-300 hover:cursor-pointer',
            )}
            onClick={() => {
              if (isOverflow) {
                setShowPopOver(!showPopOver);
              }
            }}
          >
            {set.athlete?.note}
          </div>
        ) : (
          <></>
        )}
      </div>
      {set.athlete?.note && (
        <NotePopover
          key={'notePopover' + set.index}
          showPopOver={showPopOver}
          note={set.athlete?.note}
          btnRef={noteRef}
          setShowPopOver={setShowPopOver}
        />
      )}
    </Fragment>
  );
};
