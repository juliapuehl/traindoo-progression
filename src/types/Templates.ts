import {DayType, SupersetMeta} from '../traindoo_shared/types/Training';

export type DayTemplateType = {
  id: string;
  name: string;
  training: DayType;
};

export type WeekTemplateType = {
  id: string;
  name: string;
  feedback: string;
  trainingDays: {
    dayKey: string;
    dayName: string;
    exercises: any;
    noTraining: boolean;
    supersetMeta?: SupersetMeta;
  }[];
};

export type CycleTemplateType = {
  id: string;
  name: string;
  template: {
    [weekKey: string]: WeekTemplateType;
  };
};
