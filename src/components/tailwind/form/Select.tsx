import {Fragment, HTMLAttributes, useState} from 'react';
import {Listbox, Transition} from '@headlessui/react';
import {CheckIcon, ChevronUpDownIcon} from '@heroicons/react/20/solid';
import {twMerge} from 'tailwind-merge';

export const Select = ({
  options,
  placeholder = 'Choose..',
  label,
  onChange,
  onClick,
  value,
  className,
  classNameButton,
}: {
  options: string[];
  placeholder?: string;
  label?: string;
  onChange: (newValue: string) => void;
  onClick?: () => void;
  value: string;
  className?: HTMLAttributes<any>['className'];
  classNameButton?: HTMLAttributes<any>['className'];
}) => {
  return (
    <div className={className}>
      <Listbox value={value ?? ''} onChange={onChange} as={Fragment}>
        {({open}) => (
          <>
            {label && (
              <Listbox.Label className="block text-sm font-medium text-gray-700">
                {label}
              </Listbox.Label>
            )}
            <div className="relative">
              <Listbox.Button
                onClick={onClick}
                className={twMerge(
                  'relative w-full inline-flex items-center justify-between cursor-default rounded-md border-2 border-gray-300 p-2 text-left shadow-sm focus:outline-none  ', //focus:ring-1 focus:ring-highlight-500 focus:border-highlight-500
                  classNameButton,
                )}
              >
                <span className="truncate">
                  {typeof value === 'undefined' ? placeholder : value}
                </span>
                <ChevronUpDownIcon
                  className="pointer-events-none h-5 w-5 text-gray-400" //
                  aria-hidden="true"
                />
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {options.map((option, index) => (
                    <Listbox.Option
                      key={index}
                      className={({active}) =>
                        twMerge(
                          'text-gray-900 relative cursor-default select-none py-2 pl-3 pr-9',
                          active && 'bg-gray-100',
                        )
                      }
                      value={option}
                    >
                      {({selected: isSelected}) => (
                        <>
                          <div className="flex items-center">
                            <span
                              className={twMerge(
                                isSelected ? 'font-semibold' : 'font-normal',
                                'block truncate',
                              )}
                            >
                              {option}
                            </span>
                          </div>

                          {isSelected ? (
                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-highlight-600">
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>
    </div>
  );
};
