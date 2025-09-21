import { AuthState } from '../../auth/store/auth.state';
import { ReservationState } from '../../reservations/store/reservation.state';

export interface AppState {
    auth: AuthState;
    reserv: ReservationState;
}
