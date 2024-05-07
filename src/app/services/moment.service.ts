import { Injectable } from '@angular/core';
import moment, { Moment } from 'moment';
import { Observable, Subject } from 'rxjs';
import { WeekDay } from '../interfaces/week-day';

@Injectable({
  providedIn: 'root'
})
export class MomentService {
  private timeSubject = new Subject<string>();
  private dateSubject = new Subject<string>();
  private yearSubject = new Subject<string>();
  private showedMonthSubject = new Subject<string>();

  time$: Observable<string> = this.timeSubject.asObservable();
  date$: Observable<string> = this.dateSubject.asObservable();
  year$: Observable<string> = this.yearSubject.asObservable();
  showedMonth$: Observable<string> = this.showedMonthSubject.asObservable();

  constructor() {
    setInterval(() => {
      const currentTime = moment().format('HH:mm:ss');
      const currentDate = moment().format('dddd, DD MMMM YYYY');
      const currentYear = moment().format('YYYY');

      this.timeSubject.next(currentTime);
      this.dateSubject.next(currentDate);
      this.yearSubject.next(currentYear);
    }, 1000);
  }

  getDaysCount() {
    console.log(moment().daysInMonth());
  }

  getShowedMonth = () => localStorage.getItem('showedMonth') || moment().format('MMMM');

  setShowedMonth = (month: string) => localStorage.setItem('showedMonth', month);

  getWeekDays(timestamp?: number): WeekDay[] {
    moment.updateLocale('uk', {
      week: {
        dow: 1,
      },
    });

    const date = timestamp ? moment(timestamp) : moment();

    const startOfWeek = date.clone().startOf('week');
    const endOfWeek = date.clone().endOf('week');

    let days = [];
    let currentDay = moment(startOfWeek);
    while (currentDay <= endOfWeek) {
      days.push(this.parseDateToObject(currentDay, false));
      currentDay.add(1, 'days');
    }

    return days;
  }

  parseDateToObject(date: Moment, isNotThisMonth: boolean): WeekDay {
      const splittedDate = moment(date).format('dddd | DD MMMM | YYYY').split(' | ');
      return {
        dayOfWeek: splittedDate[0],
        numberAndMonth: splittedDate[1],
        year: splittedDate[2],
        datestamp: moment(date).valueOf(),
        isNotThisMonth: isNotThisMonth
      };
  }


  getMonthDays(timestamp?: number): WeekDay[] {
    const date = timestamp ? moment(timestamp) : moment();
    let days = [];

    const startOfMonth = date.clone().startOf('month');
    const endOfMonth = date.clone().endOf('month');
    const firstWeek = this.getWeekDays(moment(startOfMonth).valueOf());
    const lastWeek = this.getWeekDays(moment(endOfMonth).valueOf());
    const previousMonthDays: WeekDay[] = [];
    const nextMonthDays: WeekDay[] = [];
    firstWeek.map(day => {
      if(+day.numberAndMonth.split(' ')[0] > 21) {
        day.isNotThisMonth = true;
        previousMonthDays.push(day);
      }
    });

    lastWeek.map(day => {
      if(+day.numberAndMonth.split(' ')[0] <= 6) {
        day.isNotThisMonth = true;
        nextMonthDays.push(day);
      }
    });

    let currentDay = moment(startOfMonth);
    while (currentDay <= endOfMonth) {
      days.push(this.parseDateToObject(currentDay, false));
      currentDay.add(1, 'days');
    }
    days.unshift(...previousMonthDays);
    days.push(...nextMonthDays);

    return days;
  }

  updateShowedMonth(): WeekDay[] {
    const showedMonth = moment.months().indexOf(this.getShowedMonth());
    const firstDayOfShowedMonth = moment().set({ month: showedMonth, date: 1, year: +moment().format('YYYY') })
    return this.getMonthDays(moment(firstDayOfShowedMonth).valueOf());
  }

  getToday(): WeekDay {
    const date = moment().format('dddd | DD MMMM | YYYY').split(' | ');
    return {
      dayOfWeek: date[0],
      numberAndMonth: date[1],
      year: date[2],
      datestamp: moment().valueOf(),
      isNotThisMonth: false
    };
  }
}
