import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { HourCalendarComponent } from "./hour/hour.component";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatCardModule, MatDatepickerModule, CommonModule, HourCalendarComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarComponent {
  selectedDates: Date[] = [];
  selectedDate: Date | null = null;
  minDate: Date = new Date();
  maxDate: Date = new Date();
  selectedHours: { [key: string]: string[] } = {};

  reservedDates: Date[] = [new Date('2024-07-15'), new Date('2024-07-25')];
  availableDates: Date[] = [new Date('2024-07-16'), new Date('2024-07-18')];

  constructor() {}

  ngOnInit(): void {
    this.initMaxDate();
  }

  initMaxDate() {
    this.maxDate.setFullYear(this.maxDate.getFullYear() + 1);
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  dateClass = (date: Date) => {
    const dateString = date.toDateString();
    if (
      this.selectedHours[dateString] &&
      this.selectedHours[dateString].length > 0
    ) {
      return 'reserved-date';
    } else {
      return 'available-date';
    }
  };

  updateSelectedHours(dateString: string, hours: string[]) {
    this.selectedHours[dateString] = hours;
  }

  select(date: Date | null) {
    if (!date) return;

    this.selectedDate = date;
    this.selectedDates.push(this.selectedDate);
    console.log(this.formatDate(this.selectedDate));
  }
}
