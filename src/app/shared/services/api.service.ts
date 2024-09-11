import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  ApiResponse,
  CreateReservationModel,
  ResponseReservationModel,
} from '../../reservation/models/reservations.model';
import {
  LoginInterface,
  LoginResponse,
  RegisterInterface,
} from '../../auth/models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:3000';
  // private apiUrl = 'https://reservation-api-gamma.vercel.app';

  private registerUrl = this.apiUrl + '/register';
  private loginUrl = this.apiUrl + '/login';
  private reservationsUrl = this.apiUrl + '/reservations';

  //Register
  register(user: RegisterInterface): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.registerUrl, user);
  }

  //login
  login(payload: LoginInterface): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, payload);
  }

  //Reservations
  getAllReservations(): Observable<ResponseReservationModel> {
    return this.http.get<ResponseReservationModel>(this.reservationsUrl);
  }

  addNewReservation(
    reservation: CreateReservationModel
  ): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.reservationsUrl, reservation);
  }

  deleteReservation(id: string): Observable<ApiResponse> {
    const url = `${this.reservationsUrl}/${id}`;
    return this.http.delete<ApiResponse>(url);
  }

  updateReservation(id: string, partialUpdate: any): Observable<ApiResponse> {
    const url = `${this.reservationsUrl}/${id}`;
    return this.http.patch<ApiResponse>(url, partialUpdate);
  }
}
