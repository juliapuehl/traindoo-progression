import {CheckIcon, NoSymbolIcon} from '@heroicons/react/24/outline';
import {useEffect, useState} from 'react';
import {useTrackingSession} from '../progressionFeature/model/useTrackingSession';
import {RoundedIconButton} from '../tailwind/buttons/RoundedIconButton';
import {useNoteConnect} from './model/useNoteConnect';

export type Callback = () => void;

export const NoteEditor = ({
  exerciseIndex,
  onClose,
  height,
}: {
  exerciseIndex: number;
  onClose: Callback;
  height?: string;
}) => {
  const {registerUserActivity} = useTrackingSession();
  const {value, save} = useNoteConnect(exerciseIndex);
  const [note, setNote] = useState<string>(value);

  useEffect(() => setNote(value ?? ''), [value]);

  const handleSave = () => {
    registerUserActivity('added comment', '');
    save(note);
    onClose();
  };

  return (
    <div className="flex gap-2 w-full">
      <textarea
        className="rounded-lg p-1 w-full min-h-full input-style"
        style={{
          height,
        }}
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <div className="flex flex-col gap-1">
        <RoundedIconButton
          icon={CheckIcon}
          alt="Edit note"
          onClick={handleSave}
          className="text-white bg-highlight hover:bg-green-500 active:bg-green-700"
        />
        <RoundedIconButton
          icon={NoSymbolIcon}
          alt="Edit note"
          onClick={onClose}
          className="text-white bg-red-600 hover:bg-red-500 active:bg-red-700"
        />
      </div>
    </div>
  );
};
