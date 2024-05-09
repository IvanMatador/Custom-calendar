import { Component, OnInit, ViewChild } from '@angular/core';
import { AppImports } from './app.imports';
import { MomentService } from './services/moment.service';

import * as moment from 'moment';
import 'moment/locale/uk';
import { distinctUntilChanged, Observable } from 'rxjs';
import { FormBuilder, FormControl } from '@angular/forms';
import { CalendarService } from './services/calendar.service';
import { CalendarComponent } from './components/calendar/calendar.component';
moment.locale('uk');

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AppImports, CalendarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Custom Calendar';

  @ViewChild(CalendarComponent) calendarComponent!: CalendarComponent;

  showedMonth: string = '';
  months: string[] = [];

  currentTime$!: Observable<string>;
  currentDate$!: Observable<string>;
  currentYear$!: Observable<string>;

  calendarType: FormControl = this.fb.control('');
  monthsList: FormControl = this.fb.control('');

  constructor(private momentService: MomentService,
              private calendarService: CalendarService,
              private fb: FormBuilder)
  {
    const calendarType = this.calendarService.getCalendarType();
    this.calendarService.setCalendarType(calendarType);
    this.calendarType.setValue(calendarType);
    this.monthsList.setValue(moment.localeData('uk').months().indexOf(this.momentService.getShowedMonth()));
  }

  ngOnInit() {
    this.currentTime$ = this.momentService.time$.pipe(distinctUntilChanged());
    this.currentDate$ = this.momentService.date$.pipe(distinctUntilChanged());
    this.currentYear$ = this.momentService.year$.pipe(distinctUntilChanged());
    this.showedMonth = this.momentService.getShowedMonth();
    this.momentService.setShowedMonth(this.showedMonth);
    this.months = moment.localeData('uk').months();
  }

  setCalendarType(type: any) {
    this.calendarService.setCalendarType(type);
  }

  setShowedMonth(monthIndex: number) {
    this.showedMonth = this.months[monthIndex];
    this.momentService.setShowedMonth(this.showedMonth);
    this.calendarComponent.updateShowedDays();
  }
}
