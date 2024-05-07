import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CalendarService } from '../../services/calendar.service';
import { AppImports } from '../../app.imports';
import { MomentService } from '../../services/moment.service';
import { WeekDay } from '../../interfaces/week-day';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [AppImports],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit, OnDestroy {

  @Input('calendarType') calendarType: string = 'week';


  cols: number = 7;

  weekDays: WeekDay[] = [];
  monthDays: WeekDay[] = [];
  showedDays: WeekDay[] = [];

  destroy$: Subject<any> = new Subject();

  constructor(private calendarService: CalendarService, private momentService: MomentService) {

  }

  ngOnInit() {
    this.weekDays = this.momentService.getWeekDays();
    this.monthDays = this.momentService.updateShowedMonth();
    this.checkShowedDays();
    this.calendarService.calendarType$
      .pipe(takeUntil(this.destroy$))
      .subscribe(type => {
        this.calendarType = type;
        this.checkShowedDays();
      });
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  checkShowedDays() {
    this.calendarType === 'week' ? this.showedDays = this.weekDays : this.showedDays = this.monthDays;
  }

  checkIsToday(day: WeekDay): boolean {
    return this.calendarService.compareDates(day);
  }

  updateMonthDays() {
    this.monthDays = this.momentService.updateShowedMonth();
    console.log(this.monthDays)
    this.checkShowedDays();
  }

  openThisDay(day: WeekDay) {
    console.log(day)
  }

  getDaysActions(day: WeekDay) {
    return [];
  }

}
