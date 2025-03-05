import {ImageUrlType} from '../traindoo_shared/types/UserStorageData';

export type CheckImageValueDocumentType = {
  id: string;
  categoryId: string;
  questionId: string;
  values: {
    [id: string]: {
      checkId: string;
      date: string;
      value: ImageUrlType;
    };
  };
};

export type CheckValueDocumentType = {
  id: string;
  categoryId: string;
  questionId: string;
  values: {
    [id: string]: {
      checkId: string;
      date: string;
      value: number | string;
    };
  };
};
