import de from 'date-fns/locale/de';
import enGB from 'date-fns/locale/en-GB';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';
import {useSelector} from 'react-redux';
import {getUserLang} from '../../logic/firestore';
import {getAthleteStartDay} from '../../store/athleteSlice';

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';

type Props = {
  minDate: Date;
  startDate: Date;
  setStartDate: (date: Date) => void;
  endDate?: Date;
  excludeDateIntervals?: Array<{start: Date; end: Date}>;
};

export const CollectionDatePicker = ({
  minDate,
  startDate,
  setStartDate,
  endDate,
  excludeDateIntervals,
}: Props) => {
  const useRange = Boolean(endDate);
  const athleteStartDay = useSelector(getAthleteStartDay);
  const locale = useSelector(getUserLang) === 'en' ? enGB : de;
  const onChange = (dates) => {
    let start;
    if (useRange) {
      start = dates[0];
    } else {
      start = dates;
    }
    setStartDate(start);
  };

  return (
    <DatePicker
      selected={startDate}
      onChange={onChange}
      startDate={startDate}
      endDate={endDate}
      minDate={minDate}
      selectsRange={useRange}
      locale={locale}
      inline
      showWeekNumbers
      calendarStartDay={(athleteStartDay + 1) % 7}
      excludeDateIntervals={excludeDateIntervals}
    />
  );
};
