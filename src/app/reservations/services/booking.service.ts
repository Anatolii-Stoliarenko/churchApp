import { inject, Injectable } from '@angular/core';

import { ReservationService } from './reservation.service';
import { PlaceType, ReservationType } from '../models/reservations.model';

@Injectable({
    providedIn: 'root',
})
export class BookingService {
    reserveService = inject(ReservationService);

    getWeekOptions(): string[] {
        return Array.from({ length: 12 }, (_, i) => `${i + 1} week${i + 1 > 1 ? 's' : ''}`);
    }

    getPlaces() {
        return Object.values(PlaceType);
    }

    getTypes() {
        return Object.values(ReservationType);
    }

    getFilteredEndTimes(selectedStartTime: string, selectedDay: string, selectedPlaces: PlaceType[], possibleTimes: string[]): string[] {
        const startTimeIndex = possibleTimes.indexOf(selectedStartTime);
        if (startTimeIndex === -1) {
            console.error('Selected start time not found in possible times.');
            return [];
        }

        let reservedHours: string[] = [];

        selectedPlaces.forEach(place => {
            const placeReservedHours = this.reserveService.getReservedHours(selectedDay, place);
            reservedHours = [...reservedHours, ...placeReservedHours];
        });

        reservedHours = [...new Set(reservedHours)]; // Remove duplicates

        let filteredToHours = possibleTimes.slice(startTimeIndex + 1);

        const nextReservedHourIndex = possibleTimes.findIndex(hour => reservedHours.includes(hour) && possibleTimes.indexOf(hour) > startTimeIndex);

        if (nextReservedHourIndex !== -1) {
            filteredToHours = filteredToHours.slice(0, nextReservedHourIndex - startTimeIndex);
        }

        return filteredToHours;
    }

    getAvailableTimes(selectedDay: string, selectedPlaces: PlaceType[]): string[] {
        let availableHours: string[] = [];
        let reservedHours: string[] = [];

        selectedPlaces.forEach(place => {
            // Get the available hours for this place
            const hours = this.reserveService.getAvailableHours(selectedDay, place);

            // Get reserved hours for this place
            const reserved = this.reserveService.getReservedHours(selectedDay, place);

            // Add the available hours of this place to the list
            availableHours = [...availableHours, ...hours];

            // Add the reserved hours of this place to the reservedHours list
            reservedHours = [...reservedHours, ...reserved];
        });

        // Remove duplicates from availableHours
        availableHours = [...new Set(availableHours)];

        // Remove any hours that are reserved for any place
        availableHours = availableHours.filter(hour => !reservedHours.includes(hour));
        return availableHours;
    }
}
