import { Injectable } from '@angular/core';
import moment from 'moment';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MomentService {
  private timeSubject = new Subject<string>();
  private dateSubject = new Subject<string>();
  private yearSubject = new Subject<string>();

  time$: Observable<string> = this.timeSubject.asObservable();
  date$: Observable<string> = this.dateSubject.asObservable();
  year$: Observable<string> = this.yearSubject.asObservable();

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
}
