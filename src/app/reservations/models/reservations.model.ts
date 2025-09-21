import {
  CurrentUserInterface,
  UserInterface,
} from '../../auth/models/auth.model';

// Interface for data sent to the backend
export interface CreateReservationModel {
  date: string;
  startHour: string;
  endHour: string;
  place: PlaceType;
  user: UserInterface;
  comments?: string;
  status?: ReservationStatus;
  type?: ReservationType;
}

// Interface for data received from the backend
export interface FetchedReservationModel {
  id: string;
  date: string;
  startHour: string;
  endHour: string;
  place: PlaceType;
  user: UserModel;
  createdAt: string;
  updatedAt: string;
  comments?: string;
  status?: ReservationStatus;
  type?: ReservationType;
}

export interface updateReservationInterface {
  id?: string;
  user?: UserModel;
  startHour?: string;
  endHour?: string;
  place?: PlaceType;
  comments?: string;
  status?: ReservationStatus;
  type?: ReservationType;
}

export interface ReservationModel {
  id: string;
  date: string; // The selected date in 'yyyy-MM-dd' format
  startHour: string;
  endHour: string;
  place: PlaceType;
  user: UserModel;
  comments?: string;
  status?: ReservationStatus;
  type?: ReservationType;
  createdAt?: string;
  updatedAt?: string;
}

export interface DaysReservationModel {
  date: string; // The date in 'yyyy-MM-dd' format
  reservations: ReservationModel[]; // List of reservations for this day
}

export interface BookingModel {
  startHour: string;
  endHour: string;
  places: PlaceType[];
  comments: string;
  repeat: string;
  date?: string;
  type: ReservationType;
}

export interface CheckConflictModel {
  startHour: string;
  endHour: string;
  place: PlaceType;
  date: string;
}

export interface ResponseReservationModel {
  reservations: FetchedReservationModel[];
  message: string;
}

export enum PlaceType {
  BALKON = 'Balkon',
  DUZA_KAPLICA = 'Duża kaplica',
  MALA_KAPLICA = 'Mała kaplica',
  KACHETYCZNE = 'Katechetyczne',
  HARCOWKA = 'Harcówka',
}

export enum ReservationStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
}

export enum ReservationType {
  PL = 'PL',
  UA = 'UA',
  OTHER = 'Other',
}

export interface ApiResponse {
  message: string;
}

export interface UserModel {
  id: string;
  name: string;
  email: string;
  phone?: string;
  contactEmail?: string;
  role: string;
}

export interface ConfirmDialogDetailModel {
  status: ReservationStatus;
  user: CurrentUserInterface;
  repeat?: string;
  places: PlaceType[];
  date?: string;
  startHour: string;
  endHour: string;
  comments: string;
  type: ReservationType;
}

export interface NewReservationModel {
  status: ReservationStatus;
  user: CurrentUserInterface;
  repeat?: string;
  places: PlaceType[];
  date: string;
  startHour: string;
  endHour: string;
  comments: string;
  type: ReservationType;
}

export type TimeSlot =
  | '00:00'
  | '00:30'
  | '01:00'
  | '01:30'
  | '02:00'
  | '02:30'
  | '03:00'
  | '03:30'
  | '04:00'
  | '04:30'
  | '05:00'
  | '05:30'
  | '06:00'
  | '06:30'
  | '07:00'
  | '07:30'
  | '08:00'
  | '08:30'
  | '09:00'
  | '09:30'
  | '10:00'
  | '10:30'
  | '11:00'
  | '11:30'
  | '12:00'
  | '12:30'
  | '13:00'
  | '13:30'
  | '14:00'
  | '14:30'
  | '15:00'
  | '15:30'
  | '16:00'
  | '16:30'
  | '17:00'
  | '17:30'
  | '18:00'
  | '18:30'
  | '19:00'
  | '19:30'
  | '20:00'
  | '20:30'
  | '21:00'
  | '21:30'
  | '22:00'
  | '22:30'
  | '23:00'
  | '23:30';
