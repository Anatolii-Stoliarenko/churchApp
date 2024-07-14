import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'hour-calendar',
  templateUrl: './hour.component.html',
  styleUrls: ['./hour.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatListModule,
    MatButtonModule,
    HourCalendarComponent,
  ],
})
export class HourCalendarComponent implements OnInit, OnChanges {
  @Input() selectedDate: Date | null = null;
  @Input() selectedHours: string[] = [];
  @Output() hoursChanged = new EventEmitter<string[]>();
  hours: string[] = [];

  ngOnInit(): void {
    this.generateHours();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedDate']) {
      this.generateHours();
    }
  }

  generateHours(): void {
    this.hours = [];
    if (this.selectedDate) {
      for (let i = 0; i < 24; i++) {
        const hourString = `${this.pad(i, 2)}:00`;
        this.hours.push(hourString);
      }
    }
  }

  pad(num: number, size: number): string {
    let s = num.toString();
    while (s.length < size) s = '0' + s;
    return s;
  }

  toggleHourSelection(hour: string): void {
    const index = this.selectedHours.indexOf(hour);
    if (index >= 0) {
      this.selectedHours.splice(index, 1);
    } else {
      this.selectedHours.push(hour);
    }
    this.hoursChanged.emit(this.selectedHours);
  }

  isHourSelected(hour: string): boolean {
    return this.selectedHours.includes(hour);
  }
}
