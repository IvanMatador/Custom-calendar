export interface ActionEvent {
  name: string;
  start: number;
  end: number;
  repetition: 'week' | 'month' | 'day' | 'year' | 'once';
  period: string | number;
  isHoliday: boolean;
}

