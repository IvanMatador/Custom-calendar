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

export interface ActionEvent {
  name: string;
  type: string;
  start: number;
  end: number;
  repetition: 'week' | 'month' | 'day' | 'year' | 'once';
  isHoliday: boolean;
}

