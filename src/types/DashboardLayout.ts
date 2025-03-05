export type WebAppLayoutType = {
  dailyCheckLayout: DailyCheckLayoutType;
};

export type DailyCheckLayoutType = {
  elements: DailyCheckLayoutElementsType;
  layout: LayoutType;
  questionColors: {[questionKey: string]: string};
};

export type DailyCheckLayoutElementsType = {
  [elementKey: string]: DailyCheckDashboardElementType;
};

export type DailyCheckDashboardElementType = {
  minH: number;
  minW: number;
  index: number;
  elementKey: string;
  questionKey?: {categoryId: string; questionId: string};
  name?: string;
  cardMode?: boolean;
  checkKeys?: Array<{categoryId: string; questionId: string}> | [];
  startDate?: string | undefined;
  endDate?: string | undefined;
  editable?: boolean;
  timeFrame?: string;
  type: 'graph' | 'text' | 'table' | 'media';
};

export type LayoutType = {
  [breakpointKey: string]: Array<LayoutElementType>;
};

export type LayoutElementType = {
  static: boolean;
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minH: number;
  minW: number;
};
