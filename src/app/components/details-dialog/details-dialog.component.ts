import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { AppImports } from '../../app.imports';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { WeekDay } from '../../interfaces/week-day';
import { CalendarService } from '../../services/calendar.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MomentService } from '../../services/moment.service';
import { ActionEvent } from '../../interfaces/actions';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-details-dialog',
  standalone: true,
  imports: [AppImports, MatDialogTitle, MatDialogContent],
  templateUrl: './details-dialog.component.html',
  styleUrl: './details-dialog.component.scss'
})
export class DetailsDialogComponent implements OnInit {

  @ViewChild('viewPanel') viewPanel: any;
  @ViewChild('editPanel') editPanel: any;

  eventForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    startHours: ['', Validators.required],
    endHours: ['', Validators.required],
    startMinutes: ['', Validators.required],
    endMinutes: ['', Validators.required],
  });

  day!: WeekDay;
  isToday: boolean = false;
  isHoliday: boolean = false;
  isEdit: boolean = false;
  choosedRepetition: 'week' | 'month' | 'day' | 'year' | 'once' = 'once';
  repetitions: any[] = [
    {value: 'once', name: 'Не повторювати'},
    {value: 'day', name: 'Кожен день'},
    {value: 'week', name: 'Кожен тиждень'},
    {value: 'month', name: 'Кожен місяць'},
    {value: 'year', name: 'Кожен рік'},
  ];

  hours: any[] = [];
  minutes: any[] = [];

  editableEvent: ActionEvent | null = null;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
              private fb: FormBuilder,
              private snackBar: MatSnackBar,
              private calendarService: CalendarService,
              private momentService: MomentService) {
    this.day = this.data.day;
  }

  ngOnInit() {
    this.hours = this.momentService.getHours();
    this.minutes = this.momentService.getMinutes();
    this.isToday = this.calendarService.compareDates(this.day);
  }

  saveEvent() {
    const formData = this.eventForm.getRawValue();
    const eventObject: ActionEvent = {
      name: formData.name,
      start: this.momentService.getTimestampByTime(this.day.numberAndMonth + ', ' + this.day.year + ', ' + formData.startHours + ':' + formData.startMinutes),
      end: this.momentService.getTimestampByTime(this.day.numberAndMonth + ', ' + this.day.year + ', ' + formData.endHours + ':' + formData.endMinutes),
      repetition: this.choosedRepetition,
      isHoliday: this.isHoliday,
      period: this.getPeriod(this.day.datestamp)
    };
    this.momentService.saveEvent(eventObject);

    if(this.editableEvent) {
      this.deleteEvent(this.editableEvent);
      this.editableEvent = null;
    }

    this.snackBar.open(`Подію ${this.isEdit ? 'змінено' : 'збережено'}`, '', {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: 'success-snack'
    });

    this.isEdit = false;
    this.eventForm.reset();
  }

  getPeriod(timestamp: number): number | string {
    let pattern = 'none';
    if(this.choosedRepetition === 'once') return pattern;
    if(this.choosedRepetition === 'day') return 'each';
    switch(this.choosedRepetition) {
      case 'year':
        pattern = 'DD MM';
        break;

      case 'month':
        pattern = 'DD';
        break;

      case 'week':
        pattern = 'dddd';
        break;

      default: return 'once';
    }
    return this.momentService.getFormatByPattern(timestamp, pattern);
  }

  getTimeFromTimestamp(timestamp: number) {
    return this.momentService.getTimeFromTimestamp(timestamp);
  }

  editEvent(event: ActionEvent) {
    this.isEdit = true;
    this.eventForm.get('name')?.setValue(event.name);
    this.eventForm.get('startHours')?.setValue(+this.momentService.getFormatByPattern(event.start, 'HH')*1);
    this.eventForm.get('startMinutes')?.setValue(+this.momentService.getFormatByPattern(event.start, 'mm')*1);
    this.eventForm.get('endHours')?.setValue(+this.momentService.getFormatByPattern(event.end, 'HH')*1);
    this.eventForm.get('endMinutes')?.setValue(+this.momentService.getFormatByPattern(event.end, 'mm')*1);
    this.choosedRepetition = event.repetition;
    this.isHoliday = event.isHoliday;
    this.viewPanel.close();
    this.editPanel.open();
    this.editableEvent = event;
  }

  deleteEvent(event: ActionEvent) {
    const allEvents = this.momentService.getAllDaysEvents();
    const eventForRemoving = allEvents.find((commonEvent: ActionEvent) => commonEvent.start === event.start
                                                            && commonEvent.end === event.end
                                                            && commonEvent.name === event.name
                                                            && commonEvent.period === event.period);
    if(eventForRemoving) {
      const idx = allEvents.indexOf(eventForRemoving);
      allEvents.splice(idx, 1);
      this.momentService.saveAllEvents(allEvents);
    }
    this.day.events?.splice(this.day.events?.indexOf(event), 1);

    this.snackBar.open(`Подію видалено!`, '', {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: 'success-deleted'
    });
  }

}
