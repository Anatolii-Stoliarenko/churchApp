import { Component, inject } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { ListComponent } from '../list/list.component';
import { DaysReservationModel } from '../../models/reservations.model';
import { ReservationService } from '../../services/reservation.service';
import { DetailsComponent } from '../details/details.component';
import { AppState } from '../../../shared/store/appState.interface';
import { currentUserSelector } from '../../../auth/store/auth.selectors';
import { UtilsService } from '../../../shared/services/utils.service';

@Component({
  selector: 'app-full-list',
  standalone: true,
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, // Optional: Locale for date formatting
  ],
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
    DetailsComponent,
    MatChipsModule,
    MatAutocompleteModule,
  ],

  templateUrl: './full-list.component.html',
  styleUrl: './full-list.component.scss',
})
export class FullListComponent {
  reservationService = inject(ReservationService);
  utilsService = inject(UtilsService);
  store = inject(Store<AppState>);
  currentUser$ = this.store.select(currentUserSelector);

  startDay: string = new Date().toISOString().split('T')[0];
  endDay: string = new Date().toISOString().split('T')[0];

  reservationsOfDays: DaysReservationModel[] = [];
  selectedFilters: { label: string; group: string }[] = [];

  // Grouped filter data
  groupedFilters = [
    {
      name: 'Types',
      items: ['UA', 'PL', 'Other'],
    },
    {
      name: 'Places',
      items: [
        'Balkon',
        'Duża kaplica',
        'Mała kaplica',
        'Katechetyczne',
        'Harcówka',
      ],
    },
    {
      name: 'Status',
      items: ['Approved', 'Pending'],
    },
  ];

  ngOnInit() {
    this.filterByDate();
  }

  // Filter reservations by date and selected chips
  filterByDate() {
    this.reservationsOfDays = this.reservationService.getReservationsFromToDays(
      this.startDay,
      this.endDay,
      this.selectedFilters // Passing filters to the service
    );
    this.utilsService.triggerVibration();
  }

  // Add selected filter as chip and apply filter
  addFilterAsChip(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      const filter = this.findFilterInGroups(value);
      if (filter && !this.isFilterSelected(filter)) {
        this.selectedFilters.push(filter);
      }
    }
    if (event.chipInput.inputElement) {
      event.chipInput.inputElement.value = '';
    }
    this.filterByDate(); // Reapply filter after adding chip
  }

  // Remove selected filter chip and apply filter
  removeFilterAsChip(filter: { label: string; group: string }): void {
    const index = this.selectedFilters.indexOf(filter);
    if (index >= 0) {
      this.selectedFilters.splice(index, 1);
    }
    this.filterByDate(); // Reapply filter after removing chip
  }

  // Add selected autocomplete option and apply filter
  selectedFilter(event: any): void {
    const value = event.option.value;
    const group = this.findFilterGroup(value);
    if (group && !this.isFilterSelected({ label: value, group })) {
      this.selectedFilters.push({ label: value, group });
    }
    this.filterByDate(); // Reapply filter after selecting autocomplete
  }

  private findFilterInGroups(
    value: string
  ): { label: string; group: string } | null {
    for (const group of this.groupedFilters) {
      if (group.items.includes(value)) {
        return { label: value, group: group.name };
      }
    }
    return null;
  }

  private findFilterGroup(value: string): string | null {
    for (const group of this.groupedFilters) {
      if (group.items.includes(value)) {
        return group.name;
      }
    }
    return null;
  }

  isFilterSelected(filter: { label: string; group: string }): boolean {
    return this.selectedFilters.some(
      (selected) =>
        selected.label === filter.label && selected.group === filter.group
    );
  }
}
