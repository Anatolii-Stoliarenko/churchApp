import { FetchedReservationModel } from '../models/reservations.model';

export interface ReservationState {
  selectedDay: string | null;
  reservations: FetchedReservationModel[] | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

export const initialReserveState: ReservationState = {
  selectedDay: null,
  reservations: null,
  loading: false,
  error: null,
  message: null,
};
