import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { ReservationService } from '../services/reservation.service';

@Component({
  selector: 'app-hours',
  standalone: true,
  imports: [MatSelectModule, MatFormFieldModule, MatButtonModule],
  templateUrl: './hours.component.html',
  styleUrl: './hours.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HoursComponent implements OnInit {
  @Input() selectedDay: string = '';
  rs = inject(ReservationService);

  availableHours: string[] = [];

  ngOnInit(): void {
    this.updateDataSource();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedDay']) {
      this.updateDataSource();
    }
  }

  updateDataSource(): void {
    if (this.selectedDay) {
      this.availableHours = this.rs.getAvailableHours(this.selectedDay);
    }
  }
}
