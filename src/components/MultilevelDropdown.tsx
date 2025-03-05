import {Listbox, Transition} from '@headlessui/react';
import {
  ChevronDownIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/20/solid';
import {Dispatch, Fragment, SetStateAction, useState} from 'react';

//TODO: MISSION OVERLOAD xio @Fabi define types :)
type ValuesType = any[];

type Props = {values: ValuesType};

export function MultilevelDropdown({values}: Props) {
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [extendedArray, setExtendedArray] = useState([]);

  return (
    <div className="">
      <Listbox value={selectedPeople} multiple>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-72 cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            <span className="block truncate">{'Muskelgruppe'}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute mt-1 min-w-[288px] w-fit overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {SubMenu(
                setSelectedPeople,
                selectedPeople,
                extendedArray,
                setExtendedArray,
                'main',
                values,
                [],
              )}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}

const SubMenu = (
  setSelectedPeople: Dispatch<
    SetStateAction<
      {
        id: number;
        name: string;
      }[]
    >
  >,
  selectedPeople: any,
  extendedArray: string[],
  setExtendedArray: Dispatch<SetStateAction<string[]>>,
  key: string,
  values: ValuesType,
  path: string[],
) => {
  if (values) {
    return Object.entries(values).map((value) =>
      SubItem(
        setSelectedPeople,
        selectedPeople,
        value[1],
        value[0],
        extendedArray,
        setExtendedArray,
        key + values[2],
        [...path, value[0]],
      ),
    );
  } else {
    return <></>;
  }
};

const SubItem = (
  setSelectedPeople: Dispatch<
    SetStateAction<
      {
        id: number;
        name: string;
      }[]
    >
  >,
  selectedPeople: any,
  value: any,
  valueId: string,
  extendedArray: string[],
  setExtendedArray: Dispatch<SetStateAction<string[]>>,
  key: string,
  path: string[],
) => {
  const toggleExtended = () => {
    const keyIndex = extendedArray.findIndex((item) => item === valueId);
    if (keyIndex === -1) {
      setExtendedArray([...extendedArray, valueId]);
    } else {
      const newArray = extendedArray.filter(
        (element) => !element?.includes(valueId),
      );
      setExtendedArray(newArray);
    }
  };
  const canExtend = value?.values;
  const extended = extendedArray?.includes(valueId);
  const toggleChecked = () => {
    const valueIndex = selectedPeople.findIndex((item) => item === valueId);
    const generateValueTree = (element: any) => {
      const returnArr: any[] = [element.name];
      const subValues: any[] = element?.values
        ? (Object.values(element?.values).reduce((arr: any[], el: any) => {
            arr.push(el.name);
            arr.push(...generateValueTree(el));
            return arr;
          }, []) as any[])
        : [];
      return [...returnArr, ...subValues];
    };
    const valueTree = generateValueTree(value);

    if (valueIndex === -1) {
      setSelectedPeople([...selectedPeople, ...valueTree, ...path]);
    } else {
      const newArray = selectedPeople.filter(
        (element) => !valueTree?.includes(element),
      );
      setSelectedPeople(newArray);
    }
  };
  return (
    <>
      <Listbox.Option
        value={valueId}
        className={({active}) =>
          `relative cursor-default select-none py-2 pl-10 pr-4 pr-10 ${
            active ? 'bg-amber-100 text-amber-900' : 'text-gray-900'
          }`
        }
        key={key}
      >
        {({selected}) => (
          <>
            <span
              className={`flex justify-between truncate ${
                selected ? 'font-medium' : 'font-normal'
              }`}
              onClick={toggleExtended}
            >
              {value?.name ?? ''}
              {canExtend &&
                (extended ? (
                  <ChevronUpIcon className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                ))}
            </span>

            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
              <input
                id="default-checkbox"
                type="checkbox"
                checked={selected}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                onChange={toggleChecked}
              />
            </span>
          </>
        )}
      </Listbox.Option>
      <div className="pl-4">
        {canExtend &&
          extended &&
          SubMenu(
            setSelectedPeople,
            selectedPeople,
            extendedArray,
            setExtendedArray,
            'main',
            value?.values ?? {},
            [...path, valueId],
          )}
      </div>
    </>
  );
};
