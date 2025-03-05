import {ImageUrlType} from '../traindoo_shared/types/UserStorageData';

export type UserStorageDataType = {
  dailyProgressImages: DailyProgressArray;
};

export type DailyProgressArray = {
  data: {
    [key: string]: {
      // TrainingId

      startDate: string;
      days: {
        [key: string]: {
          // DayIndex
          frontImage: ImageUrlType;
          backImage: ImageUrlType;
          sideImage: ImageUrlType;
          additionalImage: ImageUrlType;
          date: string;
        };
      };
    };
  };
};
