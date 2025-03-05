import {useEffect, useState} from 'react';
import {twMerge} from 'tailwind-merge';
import {useNoteConnect} from './exercise/model/useNoteConnect';

type Props = {
  exerciseIndex: number;
};

export const NoteTextField = ({exerciseIndex}: Props) => {
  const {value, save} = useNoteConnect(exerciseIndex);
  const [note, setNote] = useState<string>(value);

  useEffect(() => setNote(value ?? ''), [value]);

  const handleSave = () => {
    save(note);
  };

  return (
    <textarea
      className={twMerge(
        'rounded-lg p-1 w-full h-full min-w-[200px] resize-none [.break_&]:hidden overflow-auto scrollbar-hide input-style',
      )}
      value={note}
      onChange={(e) => setNote(e.target.value)}
      onBlur={handleSave}
    />
  );
};
