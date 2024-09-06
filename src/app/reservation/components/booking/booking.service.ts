import { inject, Injectable } from '@angular/core';

import { ReservationService } from '../../services/reservation.service';
import { BookingModel, PlaceType } from '../../models/reservations.model';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  reserveService = inject(ReservationService);

  getWeekOptions(): string[] {
    return Array.from(
      { length: 12 },
      (_, i) => `${i + 1} week${i + 1 > 1 ? 's' : ''}`
    );
  }

  getPlaces() {
    return Object.values(PlaceType);
  }

  // Get filtered end times based on the selected start time, day, and places
  getFilteredEndTimes(
    selectedStartTime: string,
    selectedDay: string,
    selectedPlaces: PlaceType[],
    possibleTimes: string[]
  ): string[] {
    const startTimeIndex = possibleTimes.indexOf(selectedStartTime);
    if (startTimeIndex === -1) {
      console.error('Selected start time not found in possible times.');
      return [];
    }

    let reservedHours: string[] = [];

    selectedPlaces.forEach((place) => {
      const placeReservedHours = this.reserveService.getReservedHours(
        selectedDay,
        place
      );
      reservedHours = [...reservedHours, ...placeReservedHours];
    });

    reservedHours = [...new Set(reservedHours)]; // Remove duplicates

    let filteredToHours = possibleTimes.slice(startTimeIndex + 1);

    const nextReservedHourIndex = possibleTimes.findIndex(
      (hour) =>
        reservedHours.includes(hour) &&
        possibleTimes.indexOf(hour) > startTimeIndex
    );

    if (nextReservedHourIndex !== -1) {
      filteredToHours = filteredToHours.slice(
        0,
        nextReservedHourIndex - startTimeIndex
      );
    }

    return filteredToHours;
  }

  // Get available times based on day and selected places
  getAvailableTimes(
    selectedDay: string,
    selectedPlaces: PlaceType[]
  ): string[] {
    let availableHours: string[] = [];

    selectedPlaces.forEach((place) => {
      const hours = this.reserveService.getHours(selectedDay, place);
      availableHours = [...availableHours, ...hours];
    });

    return [...new Set(availableHours)]; // Remove duplicates
  }

  // Collect form data for submission
  getFormData(data: {
    startHour: string;
    endHour: string;
    places: PlaceType[];
    comments: string;
    repeat: string;
  }): BookingModel {
    return {
      startHour: data.startHour,
      endHour: data.endHour,
      places: data.places,
      comments: data.comments,
      repeat: data.repeat,
    };
  }
}
