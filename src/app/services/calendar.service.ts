import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  private calendarTypeSubject = new Subject<string>();

  calendarType$: Observable<string> = this.calendarTypeSubject.asObservable();

  constructor() { }

  setCalendarType(type: string) {
    if(type !== 'week' && type !== 'month') type = 'week';
    this.calendarTypeSubject.next(type);
    localStorage.setItem('calendarType', type)
  }
  
  getCalendarType = () => localStorage.getItem('calendarType') || 'week';
}
