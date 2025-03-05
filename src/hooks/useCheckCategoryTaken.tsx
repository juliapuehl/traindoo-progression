import {useSelector} from 'react-redux';
import {getCheckCategoryNames} from '../logic/firestore';
import {RootState} from '../store/store';

export const useCheckCategoryTaken = () => {
  const dailyCheckNames = useSelector((state: RootState) =>
    getCheckCategoryNames(state, true),
  );
  const checkIfTaken = (checkName: string) => {
    const index = dailyCheckNames.findIndex(
      (entry) => entry.name === checkName,
    );
    if (index === -1) {
      return false;
    } else {
      return true;
    }
  };
  return checkIfTaken;
};
