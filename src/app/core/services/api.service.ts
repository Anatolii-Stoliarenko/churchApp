import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

import { LoggerService } from './logger.service';

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    private readonly _http = inject(HttpClient);
    private readonly _loggerService = inject(LoggerService);
    private readonly _API_BASE_URL = environment.apiUrl;

    private handleError(error: HttpErrorResponse): Observable<never> {
        this._loggerService.error(`[API]`, error);
        return throwError(() => error);
    }

    get<T>(url: string): Observable<T> {
        return this._http.get<T>(`${this._API_BASE_URL}/${url}`).pipe(
            map(response => response),
            catchError((error: HttpErrorResponse) => this.handleError(error)),
        );
    }

    post<T>(url: string, payload?: any): Observable<T> {
        return this._http.post<T>(`${this._API_BASE_URL}/${url}`, payload).pipe(
            map(response => response),
            catchError((error: HttpErrorResponse) => this.handleError(error)),
        );
    }

    put<T>(url: string, payload?: any): Observable<T> {
        return this._http.put<T>(`${this._API_BASE_URL}/${url}`, payload).pipe(
            map(response => response),
            catchError((error: HttpErrorResponse) => this.handleError(error)),
        );
    }

    patch<T>(url: string, payload: any): Observable<T> {
        return this._http.patch<T>(`${this._API_BASE_URL}/${url}`, payload).pipe(
            map(response => response),
            catchError((error: HttpErrorResponse) => this.handleError(error)),
        );
    }

    delete<T>(url: string): Observable<T> {
        return this._http.delete<T>(`${this._API_BASE_URL}/${url}`).pipe(
            map(response => response),
            catchError((error: HttpErrorResponse) => this.handleError(error)),
        );
    }

    getBlob(url: string): Observable<Blob> {
        return this._http
            .get(`${this._API_BASE_URL}/${url}`, {
                responseType: 'blob',
            })
            .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
    }
}
