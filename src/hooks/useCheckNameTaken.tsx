import {useSelector} from 'react-redux';
import {
  getDailyCheckNames,
  getGenericCheckNames,
  getWeeklyCheckNames,
} from '../logic/firestore';

const checkIfTaken = (checkNames: string[], checkName: string) => {
  const index = checkNames.findIndex(
    (entry) => entry.trim() === checkName.trim(),
  );
  if (index === -1) {
    return false;
  } else {
    return true;
  }
};
export const useDailyCheckNameTaken = () => {
  const dailyCheckNames = useSelector(getDailyCheckNames);
  return (checkName: string) => checkIfTaken(dailyCheckNames, checkName);
};
export const useWeeklyCheckNameTaken = () => {
  const dailyCheckNames = useSelector(getWeeklyCheckNames);
  return (checkName: string) => checkIfTaken(dailyCheckNames, checkName);
};
export const useGenericCheckNameTaken = () => {
  const dailyCheckNames = useSelector(getGenericCheckNames);
  return (checkName: string) => checkIfTaken(dailyCheckNames, checkName);
};
