export type PlaceType =
  | 'Balkon'
  | 'Duża kaplica'
  | 'Mała kaplica'
  | 'Katechetyczne'
  | 'Harcówka';

export interface ReservationModel {
  date: string; // The selected date in 'yyyy-MM-dd' format
  hours: string[]; // Array of selected half-hour slots, e.g., ['09:00', '09:30', '10:00']
  place: PlaceType;
  //   user: {
  //     id: string; // Unique identifier for the user
  //     name: string; // Name of the user
  //     email: string; // Email of the user
  //   };
}
