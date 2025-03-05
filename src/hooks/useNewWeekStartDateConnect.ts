import {addDays} from 'date-fns';
import moment from 'moment';
import {useEffect, useMemo, useState} from 'react';
import {useSelector} from 'react-redux';
import {getAllTrainings, getEndDateLastPlan} from '../logic/firestore';

export const useNewWeekStartDateConnect = () => {
  const lastWeekEndDate = useSelector(getEndDateLastPlan);
  const allTrainings = useSelector(getAllTrainings);

  // Add T00:00 to use UTC
  const minDate = addDays(new Date(), -6);
  const tmpStartDate = lastWeekEndDate
    ? addDays(new Date(lastWeekEndDate), 1)
    : addDays(new Date(), -7);

  const [startDate, setStartDate] = useState(tmpStartDate);
  const [endDate, setEndDate] = useState(addDays(startDate, 6));

  const excludeArray = useMemo(() => {
    return allTrainings.map((training) => {
      const start = new Date(
        moment(training.startDate)
          .subtract(7, 'd')
          .utc()
          .startOf('day')
          .toISOString(),
      );
      return {start: start, end: addDays(start, 13)};
    });
  }, [allTrainings]);

  useEffect(() => {
    setEndDate(addDays(startDate, 6));
  }, [startDate]);

  return {startDate, setStartDate, endDate, setEndDate, minDate, excludeArray};
};
