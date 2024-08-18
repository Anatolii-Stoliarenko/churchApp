import { inject, Injectable } from '@angular/core';
import {
  PlaceType,
  ReservationModel,
  ReservationStatus,
  TimeSlot,
} from '../reservation.model';
import {
  AdminConfig,
  ModeratorConfig,
  DefaultUserConfig,
} from '../../config/users-config';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  utilsService = inject(UtilsService);

  reservations: ReservationModel[] = [
    {
      id: this.utilsService.generateId(),
      date: '2024-08-25',
      startHour: '09:00',
      endHour: '10:00',
      place: PlaceType.BALKON,
      user: { id: '1', name: AdminConfig.NAME, email: AdminConfig.EMAIL },
      status: ReservationStatus.APPROVED,
    },
    {
      id: this.utilsService.generateId(),
      date: '2024-08-25',
      startHour: '09:00',
      endHour: '10:00',
      place: PlaceType.KACHETYCZNE,
      user: { id: '1', name: AdminConfig.NAME, email: AdminConfig.EMAIL },
      status: ReservationStatus.PENDING,
    },
    {
      id: this.utilsService.generateId(),
      date: '2024-08-22',
      startHour: '07:00',
      endHour: '20:00',
      place: PlaceType.HARCOWKA,
      user: {
        id: '2',
        name: ModeratorConfig.NAME,
        email: ModeratorConfig.EMAIL,
      },
      status: ReservationStatus.REJECTED,
    },
    {
      id: this.utilsService.generateId(),
      date: '2024-08-22',
      startHour: '07:00',
      endHour: '20:00',
      place: PlaceType.MALA_KAPLICA,
      user: {
        id: '1',
        name: AdminConfig.NAME,
        email: ModeratorConfig.EMAIL,
      },
      status: ReservationStatus.PENDING,
    },
    {
      id: this.utilsService.generateId(),
      date: '2024-08-29',
      startHour: '09:00',
      endHour: '13:00',
      place: PlaceType.BALKON,
      user: {
        id: '3',
        name: DefaultUserConfig.NAME,
        email: DefaultUserConfig.EMAIL,
      },
      status: ReservationStatus.PENDING,
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
    '22:30',
    '23:00',
    '23:30',
    '00:00',
  ];

  availableTimeSlots: TimeSlot[] = [
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
    '22:30',
    '23:00',
  ];
}
