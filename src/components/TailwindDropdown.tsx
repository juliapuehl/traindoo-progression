import {Listbox, Transition} from '@headlessui/react';
import {ChevronUpDownIcon} from '@heroicons/react/20/solid';
import {Fragment, useState} from 'react';
import {twMerge} from 'tailwind-merge';

type Props = {
  values: {value: string; label: string}[];
  initialValue: {value: string; label: string};
  setNewValue: (value: string) => void;
};

export const TailwindDropdown = ({
  values,
  initialValue,
  setNewValue,
}: Props) => {
  const [selected, setSelected] = useState(initialValue.label);

  const handleChange = (value) => {
    setSelected(value.label);
    setNewValue(value.value);
  };
  return (
    <Listbox value={selected} onChange={handleChange}>
      {({open}) => (
        <div className="relative mt-2 min-w-[30%]">
          <Listbox.Button className="relative w-full cursor-default rounded-md  py-1.5 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6 input-style">
            <span className="flex items-center">
              <span className="ml-3 block truncate">
                {selected ?? 'Placeholder'}
              </span>
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>

          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {values.map((value) => (
                <Listbox.Option
                  key={value.value}
                  className={({active}) =>
                    twMerge(
                      active ? 'bg-indigo-600 text-white' : 'text-gray-900',
                      'relative cursor-default select-none py-2 pl-3 pr-9',
                    )
                  }
                  value={value}
                >
                  {({active}) => (
                    <>
                      <div className="flex items-center">
                        <span
                          className={twMerge(
                            value.label === selected
                              ? 'font-semibold'
                              : 'font-normal',
                            'ml-3 block truncate',
                          )}
                        >
                          {value.label}
                        </span>
                      </div>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  );
};
