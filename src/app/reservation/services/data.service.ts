import { Injectable } from '@angular/core';
import { PlaceType, ReservationModel, TimeSlot } from '../reservation.model';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  reservations: ReservationModel[] = [
    {
      id: 'r1', // Unique ID for the reservation
      date: '2024-07-31', // Date in 'yyyy-MM-dd' format
      startHour: '09:00', // Start time
      endHour: '10:00', // End time
      place: PlaceType.BALKON, // Example place
      user: { id: 'u1', name: 'John Doe', email: 'john.doe@example.com' }, // User object
    },
    {
      id: 'r2', // Unique ID for the reservation
      date: '2024-08-11', // Date in 'yyyy-MM-dd' format
      startHour: '07:00', // Start time
      endHour: '20:00', // End time
      place: PlaceType.HARCOWKA, // Example place
      user: { id: 'u3', name: 'Alice Jones', email: 'alice.jones@example.com' }, // User object
    },
    {
      id: 'r3', // Unique ID for the reservation
      date: '2024-08-15', // Date in 'yyyy-MM-dd' format
      startHour: '09:00', // Start time
      endHour: '13:00', // End time
      place: PlaceType.BALKON, // Example place
      user: { id: 'u2', name: 'Jane Smith', email: 'john.doe@example.com' }, // User object
    },
  ];

  availableHours: TimeSlot[] = [
    // '00:00',
    // '00:30',
    // '01:00',
    // '01:30',
    // '02:00',
    // '02:30',
    // '03:00',
    // '03:30',
    // '04:00',
    // '04:30',
    // '05:00',
    // '05:30',
    '06:00',
    '06:30',
    '07:00',
    '07:30',
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
    '20:00',
    '20:30',
    '21:00',
    '21:30',
    '22:00',
    // '22:30',
    // '23:00',
    // '23:30',
  ];
}
