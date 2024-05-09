import { ActionEvent } from "./actions";

export interface WeekDay {
  datestamp: number;
  dayOfWeek: string;
  numberAndMonth: string;
  year: string;
  isNotThisMonth: boolean;
  events?: ActionEvent[] | undefined;
}
