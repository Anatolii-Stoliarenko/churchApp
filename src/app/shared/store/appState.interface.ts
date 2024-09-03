import { AuthState } from '../../auth/store/auth.state';
import { ReservationState } from '../../reservation/store/reservation.state';

export interface AppState {
  auth: AuthState;
  reserv: ReservationState;
}
