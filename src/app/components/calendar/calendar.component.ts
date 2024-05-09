import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CalendarService } from '../../services/calendar.service';
import { AppImports } from '../../app.imports';
import { MomentService } from '../../services/moment.service';
import { WeekDay } from '../../interfaces/week-day';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DetailsDialogComponent } from '../details-dialog/details-dialog.component';

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

  editableDay!: WeekDay;

  destroy$: Subject<any> = new Subject();

  constructor(private calendarService: CalendarService,
              private momentService: MomentService,
              public dialog: MatDialog) {}

  ngOnInit() {
    this.updateShowedDays();
    this.calendarService.calendarType$
      .pipe(takeUntil(this.destroy$))
      .subscribe(type => {
        this.calendarType = type;
        this.updateShowedDays();
      });
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  updateShowedDays() {
    this.weekDays = this.momentService.getWeekDays();
    this.monthDays = this.momentService.updateShowedMonth();
    this.calendarType === 'week' ? this.showedDays = this.weekDays : this.showedDays = this.monthDays;
  }

  checkIsToday(day: WeekDay): boolean {
    return this.calendarService.compareDates(day);
  }

  checkIsHoliday(day: WeekDay): boolean {
    return !!day.events?.find(event => event.isHoliday);
  }

  openThisDay(day: WeekDay) {
    this.editableDay = day;
    const dialogRef = this.dialog.open(DetailsDialogComponent, { data: { day }});

    dialogRef.afterClosed().subscribe(() => {
      this.updateShowedDays();
    });
  }

  getTimeFromTimestamp(timestamp: number) {
    return this.momentService.getTimeFromTimestamp(timestamp);
  }
}
