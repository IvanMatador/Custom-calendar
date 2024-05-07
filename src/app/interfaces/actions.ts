export interface Action {
  type: string;
  name: string;
  duration: {
      start: string | number;
      end: string | number;
    };
  isHoliday: boolean;
  repetition: 'week' | 'month' | 'day' | 'year' | 'once';
}

export interface Actions {
  everyday?: Action[];
  everyweek?: Action[];
  everymonth?: Action[];
  annually?: Action[];
  once?: Action[];
}
