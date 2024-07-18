export enum PlaceType {
  BALKON = 'Balkon',
  DUZA_KAPLICA = 'Duża kaplica',
  MALA_KAPLICA = 'Mała kaplica',
  KACHETYCZNE = 'Katechetyczne',
  HARCOWKA = 'Harcówka',
}

export interface UserModel {
  id: string; // Unique identifier for the user
  name: string; // Name of the user
  email: string; // Email of the user
}

export interface ReservationModel {
  id: string;
  date: string; // The selected date in 'yyyy-MM-dd' format
  hours: string[]; // Array of selected half-hour slots, e.g., ['09:00', '09:30', '10:00']
  place: PlaceType;
  user: UserModel;
}
