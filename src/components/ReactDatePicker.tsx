import {ChevronUpDownIcon} from '@heroicons/react/20/solid';
import moment from 'moment';
import {forwardRef, useState} from 'react';
import DatePicker from 'react-datepicker';

type Props = {
  initialStartDate: string;
  initialEndDate: string;
  changeStartDate: (date: string) => void;
  changeEndDate: (date: string) => void;
};

export const ReactDatePicker = ({
  initialStartDate,
  initialEndDate,
  changeEndDate,
  changeStartDate,
}: Props) => {
  const [startDate, setStartDate] = useState(moment(initialStartDate).toDate());
  const [endDate, setEndDate] = useState(moment(initialEndDate).toDate());

  const onChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    changeStartDate(moment(start).toISOString());
    changeEndDate(moment(end).toISOString());
  };

  // eslint-disable-next-line react/display-name
  const CustomInput = forwardRef<HTMLButtonElement>(
    // eslint-disable-next-line react/prop-types
    ({value, onClick}: {value: string; onClick: () => void}, ref) => {
      return (
        <button
          className="relative mt-2 min-w-[30%] relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-highlight-500 sm:text-sm sm:leading-6"
          ref={ref}
          onClick={onClick}
        >
          {moment(startDate).format('L') + ' - ' + moment(endDate).format('L')}
          <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
            <ChevronUpDownIcon
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </button>
      );
    },
  );
  return (
    <DatePicker
      onChange={onChange}
      startDate={startDate}
      endDate={endDate}
      customInput={<CustomInput />}
      selectsRange
    />
  );
};
