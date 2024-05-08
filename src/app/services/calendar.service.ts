import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { WeekDay } from '../interfaces/week-day';
import { MomentService } from './moment.service';
import { Actions } from '../interfaces/actions';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  private calendarTypeSubject = new Subject<string>();

  calendarType$: Observable<string> = this.calendarTypeSubject.asObservable();

  constructor(private momentService: MomentService) { }

  setCalendarType(type: string) {
    if(type !== 'week' && type !== 'month') type = 'week';
    this.calendarTypeSubject.next(type);
    localStorage.setItem('calendarType', type)
  }

  getCalendarType = () => localStorage.getItem('calendarType') || 'week';

  compareDates(day: WeekDay): boolean {
    const today = this.momentService.getToday();
    return today.dayOfWeek === day.dayOfWeek && today.numberAndMonth === day.numberAndMonth && today.year === day.year;
  }
}
