import {Combobox} from '@headlessui/react';
import {PlusIcon} from '@heroicons/react/24/outline';
import {t} from 'i18n-js';
import {Fragment, HTMLProps, useEffect, useMemo, useState} from 'react';
import {twMerge} from 'tailwind-merge';
import {useTrackingSession} from '../progressionFeature/model/useTrackingSession';
import {InlineTextArea} from '../tailwind/form/InlineTextArea';
import {ExerciseMainLift} from './ExerciseMainLift';
import {useExerciseNameConnect} from './model/exercise/useExerciseNameConnect';
import {useLibraryConnect} from './model/useLibraryConnect';

const ListItem = ({
  selected,
  active,
  className,
  ...props
}: {
  selected: boolean;
  active: boolean;
} & HTMLProps<HTMLLIElement>) => {
  return (
    <li
      className={twMerge(
        'p-2 hover:bg-gray-100 w-full text-left',
        `block truncate`,
        selected && 'font-medium',
        active && 'bg-gray-100',
        className,
      )}
      {...props}
    />
  );
};

export const ExerciseTitle = ({exerciseIndex}: {exerciseIndex: number}) => {
  const {registerUserActivity} = useTrackingSession();
  const {value, save} = useExerciseNameConnect(exerciseIndex);

  const {searchStrings, checkExerciseName, createNewExercise} =
    useLibraryConnect();

  const [title, setTitle] = useState(value);
  const [query, setQuery] = useState('');

  useEffect(() => {
    setTitle(value);
  }, [value]);

  const filteredSearchStrings = searchStrings?.filter((entryName) =>
    entryName?.toLocaleLowerCase().includes(query?.toLocaleLowerCase()),
  );

  const [nameCheck, setNameCheck] = useState<any>();
  useMemo(() => checkExerciseName(query), [checkExerciseName, query]);

  useEffect(() => {
    const check = checkExerciseName(query);
    setNameCheck(check);
  }, [query]);
  const handleChoseTitle = (val: string) => {
    registerUserActivity('entered exercise title', '');
    if (
      val &&
      !searchStrings.find((name) => name === val) &&
      nameCheck.success
    ) {
      createNewExercise(val);
    }
    setTitle(val);
    save(val);
  };
  const displayAddButton =
    !filteredSearchStrings.find((name) => name === query) &&
    query.trim() !== '' &&
    nameCheck;
  return (
    <div
      className={`relative w-full flex flex-col gap-y-2 gap-x-0 [.break_&]:flex-row-reverse
     [.break_&]:gap-y-0 [.break_&]:gap-x-2 [.break_&]:items-center [.break_&]:justify-between`}
    >
      <Combobox value={title} onChange={handleChoseTitle}>
        <Combobox.Input
          as={InlineTextArea}
          className={twMerge(
            'text-lg font-bold w-full text-white focus:text-black hover:text-black',
            title?.length === 0 && 'bg-gray-200',
          )}
          onChange={(event) => {
            setQuery(event.target.value);
          }}
          placeholder={t('PLANNING_EXERCISE_PLACEHOLDER_NAME')}
        />
        <Combobox.Options
          className={`top-[-4px] left-0 -translate-y-full bg-white absolute z-10 w-fit-content min-w-[120px] 
        -ml-1 rounded-lg shadow-lg max-h-[16em] overflow-auto py-1 border-solid border-gray-100 border-2`}
        >
          {filteredSearchStrings.map((entryName) => (
            <Combobox.Option key={entryName} value={entryName} as={Fragment}>
              {({selected, active}) => (
                <ListItem selected={selected} active={active}>
                  {entryName}
                </ListItem>
              )}
            </Combobox.Option>
          ))}
          {displayAddButton && (
            <Combobox.Option value={query} as={Fragment}>
              {({selected, active}) => (
                <ListItem
                  selected={selected}
                  active={active}
                  className={twMerge(
                    'w-full justify-start focus:ring-0 flex items-center font-medium',
                    filteredSearchStrings.length === 0 && 'rounded-b-none',
                    !nameCheck?.success &&
                      'text-red-700 hover:bg-gray-200 active:bg-gray-200 cursor-not-allowed',
                  )}
                  title={nameCheck?.message}
                  disabled={!nameCheck?.success}
                >
                  <PlusIcon className="w-4 h-4 mr-1" />
                  Add &quot;{query}&quot;
                </ListItem>
              )}
            </Combobox.Option>
          )}
          {filteredSearchStrings.length === 0 && (
            <div className="p-2 text-gray-600">
              {t('PLANNING_EXERCISE_SEARCH_NO_OPTION')}
            </div>
          )}
        </Combobox.Options>
      </Combobox>
      <ExerciseMainLift exerciseIndex={exerciseIndex} />
    </div>
  );
};
