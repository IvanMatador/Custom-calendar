import { Action } from "./actions";

export interface WeekDay {
  datestamp: number;
  dayOfWeek: string;
  numberAndMonth: string;
  year: string;
  isNotThisMonth: boolean;
  actions?: string[] | Action[] | undefined;
}
