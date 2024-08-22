import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ReservationModel } from '../reservation/reservation.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);

  // private apiUrl = 'http://localhost:3000';
  private apiUrl = 'https://reservation-api-gamma.vercel.app';

  // Load all reservations
  loadAllReservations(): Observable<ReservationModel[]> {
    return this.http.get<ReservationModel[]>(this.apiUrl + '/reservations');
  }

  saveReservations(
    reservations: ReservationModel[]
  ): Observable<ReservationModel[]> {
    return this.http.post<ReservationModel[]>(
      this.apiUrl + '/reservations/save',
      reservations
    );
  }

  // Add a new reservation
  addReservation(
    reservation: ReservationModel
  ): Observable<ReservationModel[]> {
    return this.http.post<ReservationModel[]>(
      this.apiUrl + '/reservations',
      reservation
    );
  }

  // Delete a reservation
  deleteReservation(id: string): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }

  // Update an existing reservation
  updateReservation(reservation: ReservationModel): Observable<void> {
    const url = `${this.apiUrl}/${reservation.id}`;
    return this.http.put<void>(url, reservation);
  }
}
