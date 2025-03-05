import {
  ArrowDownIcon,
  ArrowUpIcon,
  TrashIcon,
  VideoCameraIcon,
} from '@heroicons/react/24/outline';
import {t} from 'i18n-js';
import {useEffect, useState} from 'react';
import {twMerge} from 'tailwind-merge';
import {CircleIconButton} from '../tailwind/buttons/CircleIconButton';
import {IconButton} from '../tailwind/buttons/IconButton';
import {useDeleteSetConnect} from './model/set/useDeleteSetConnect';
import {useMoveSetConnect} from './model/set/useMoveSetConnect';

export const SetButton = ({
  setIndex,
  selectedSet,
  setSelectedSet,
  videoRequired,
  updateValue,
  exerciseIndex,
}: {
  setIndex: number;
  selectedSet: number;
  setSelectedSet: (newIndex: number) => void;
  exerciseIndex: number;
  videoRequired: boolean;
  updateValue: (key: string, value: any) => void;
}) => {
  const [videoState, setVideoState] = useState<boolean>(videoRequired);

  useEffect(() => setVideoState(videoRequired), [videoRequired]);

  const deleteSet = useDeleteSetConnect(
    exerciseIndex,
    setIndex,
    setSelectedSet,
  );

  const {moveSetDown, moveSetUp} = useMoveSetConnect(
    exerciseIndex,
    setIndex,
    setSelectedSet,
  );

  const update = () =>
    setVideoState((prev) => {
      updateValue('videoRequired', !prev);
      return !prev;
    });

  if (typeof selectedSet === 'undefined')
    return (
      <IconButton
        title={t('PLANNING_EXERCISE_VIDEO_REQUIRED')}
        icon={VideoCameraIcon}
        size="sm"
        className={twMerge('text-light_gray', videoState && 'text-highlight')}
        onClick={update}
      />
    );

  if (selectedSet === setIndex)
    return (
      <CircleIconButton
        icon={TrashIcon}
        className="bg-red-700 text-white hover:bg-red-800 active:bg-red-700"
        size="sm"
        onClick={deleteSet}
      />
    );

  if (selectedSet === setIndex - 1)
    return (
      <CircleIconButton icon={ArrowDownIcon} size="sm" onClick={moveSetDown} />
    );

  if (selectedSet === setIndex + 1)
    return (
      <CircleIconButton icon={ArrowUpIcon} size="sm" onClick={moveSetUp} />
    );

  return <div></div>;
};
