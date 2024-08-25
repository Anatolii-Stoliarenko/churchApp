import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  ApiResponse,
  ReservationModel,
} from '../reservation/reservation.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);

  // private apiUrl = 'http://localhost:3000';
  private apiUrl = 'https://reservation-api-gamma.vercel.app';

  getAllReservations(): Observable<ReservationModel[]> {
    return this.http.get<ReservationModel[]>(this.apiUrl + '/reservations');
  }

  addNewReservation(reservation: ReservationModel): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      this.apiUrl + '/reservations',
      reservation
    );
  }

  deleteReservation(id: string): Observable<ApiResponse> {
    const url = `${this.apiUrl}/reservations/${id}`;
    return this.http.delete<ApiResponse>(url);
  }

  updateReservation(id: string, partialUpdate: any): Observable<ApiResponse> {
    const url = `${this.apiUrl}/reservations/${id}`;
    return this.http.patch<ApiResponse>(url, partialUpdate);
  }
}
