import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { ListComponent } from '../list/list.component';
import { ReservationModel } from '../../models/reservations.model';

@Component({
  selector: 'app-full-list',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatExpansionModule,
    ListComponent,
    MatDatepickerModule,
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    MatNativeDateModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
  ],

  templateUrl: './full-list.component.html',
  styleUrl: './full-list.component.scss',
})
export class FullListComponent {
  startDay: string = new Date().toISOString().split('T')[0];
  endDay: string = new Date().toISOString().split('T')[0];

  reservations: ReservationModel[][] = [];
}
