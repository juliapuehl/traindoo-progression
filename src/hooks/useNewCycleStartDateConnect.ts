import {addDays} from 'date-fns';
import {useState} from 'react';
import {useSelector} from 'react-redux';
import {getEndDateLastPlan} from '../logic/firestore';

export const useNewCycleStartDateConnect = () => {
  const lastWeekEndDate = useSelector(getEndDateLastPlan);

  // Add T00:00 to use UTC
  const minDate = lastWeekEndDate
    ? addDays(new Date(lastWeekEndDate), 1)
    : addDays(new Date(), -7);

  const [startDate, setStartDate] = useState(minDate);

  return {startDate, setStartDate, minDate};
};
