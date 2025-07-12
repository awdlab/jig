export const MONTHS = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
] as const;

export type Month = (typeof MONTHS)[number];

export const WEEK_DAYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const;

export type WeekDay = (typeof WEEK_DAYS)[number];

export type DayModel = {
  date: number;
  /**
   * -1 = previous month, 0 = current month, 1 = next month
   */
  monthOffset: number;
};

export type DayTemplateType = {
  $implicit: {
    date: number;
    selected: boolean;
    today: boolean;
    fromOtherMonth: boolean;
  };
};

export type WeekDayTemplateType = {
  $implicit: {
    weekDay: WeekDay;
    translation: string;
  };
};

export type MonthTemplateType = {
  $implicit: {
    month: Month;
    selected: boolean;
  };
};

export type TimeTemplateType = {
  $implicit: {
    time: Date | null;
    showSeconds: boolean;
    change: (newTime: Date | null) => void;
  };
};
