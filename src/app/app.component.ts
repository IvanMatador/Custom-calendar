import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppImports } from './app.imports';
import { MomentService } from './services/moment.service';

import * as moment from 'moment';
import 'moment/locale/uk';
import { distinctUntilChanged, Observable } from 'rxjs';
import { FormBuilder, FormControl } from '@angular/forms';
import { CalendarService } from './services/calendar.service';
moment.locale('uk');

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AppImports],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Custom Calendar';

  currentTime$!: Observable<string>;
  currentDate$!: Observable<string>;
  currentYear$!: Observable<string>;

  calendarType: FormControl = this.fb.control('');

  constructor(private momentService: MomentService, private calendarService: CalendarService, private fb: FormBuilder) {
    const calendarType = this.calendarService.getCalendarType();
    this.calendarService.setCalendarType(calendarType);
    this.calendarType.setValue(calendarType);
  }

  ngOnInit() {
    this.currentTime$ = this.momentService.time$.pipe(distinctUntilChanged());
    this.currentDate$ = this.momentService.date$.pipe(distinctUntilChanged());
    this.currentYear$ = this.momentService.year$.pipe(distinctUntilChanged());
  }

  setCalendarType(type: any) {
    this.calendarService.setCalendarType(type);
  }

  getDaysCount() {
    this.momentService.getDaysCount();
  }
}
