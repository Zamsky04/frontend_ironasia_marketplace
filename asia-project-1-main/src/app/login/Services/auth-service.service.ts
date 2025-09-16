import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { loginresponse } from '../Models/loginresponse'; // Pastikan path import ini benar

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = "http://193.111.124.45:9815"; // Pastikan URL ini benar

  // --- Bagian State Management ---
  
  // BehaviorSubject untuk menyimpan status login (true/false)
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  // Observable yang bisa di-subscribe oleh komponen lain untuk mengetahui status login
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  // BehaviorSubject untuk menyimpan data user yang sedang login
  private currentUserSubject = new BehaviorSubject<loginresponse | null>(null);
  // Observable untuk data user
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) { }

  // --- Method untuk Mengubah State ---

  /**
   * Method untuk mengubah status login dan data user.
   * Dipanggil dari LoginCompComponent setelah login berhasil.
   */
  public setLoggedIn(status: boolean, user: loginresponse | null): void {
    this.isLoggedInSubject.next(status);
    this.currentUserSubject.next(user);
  }

  /**
   * Getter sederhana untuk pengecekan sinkron (berguna untuk AuthGuard)
   */
  public get isLoggedIn(): boolean {
    return this.isLoggedInSubject.getValue();
  }

  // --- Bagian API Calls ---

  /**
   * Method untuk memanggil API login.
   * Kode Anda di sini sudah benar dengan 'withCredentials: true'.
   */
  execLogin(userid: string, userpass: string, macaddress: string): Observable<loginresponse> {
    const loginUrl = `${this.apiUrl}/auth/login`;

    const body = {
      userid: userid,
      userpass: userpass,
      macaddress: macaddress
    };

    return this.http.post<loginresponse>(loginUrl, body, {
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Method untuk memanggil API logout.
   */
  execLogout(): Observable<any> {
    const logoutUrl = `${this.apiUrl}/auth/logout`;
    return this.http.post(logoutUrl, {}, {
        withCredentials: true
    });
  }

  private handleError(error: HttpErrorResponse) {
    console.error(`Backend returned code ${error.status}, body was: `, error.error);
    return throwError(() => new Error('Login gagal. Periksa kredensial Anda atau hubungi support.'));
  }
}

/*import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { loginresponse } from '../Models/loginresponse';

export interface TokenResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = "http://193.111.124.45:9815";

  constructor(private http: HttpClient) { }

  execLogin(userid: string, userpass: string, macaddress: string): Observable <loginresponse>{//<TokenResponse> {
    
    const loginUrl = `${this.apiUrl}/auth/login`;

    // 1. Buat objek JavaScript biasa. Ini akan dikirim sebagai JSON.
    const body = {
      userid: userid,
      userpass: userpass,
      macaddress: macaddress
    };

    // 2. Kirim objek 'body'. HttpClient akan otomatis mengatur 'Content-Type: application/json'.
    // Pastikan tidak ada HttpParams atau headers manual di sini.
   // return this.http.post<loginresponse>(loginUrl, body)//<TokenResponse>(loginUrl, body)
    //  .pipe(
     //   catchError(this.handleError)
     // );

      return this.http.post<loginresponse>(loginUrl, body, {
      withCredentials: true
    }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error(`Backend returned code ${error.status}, body was: `, error.error);
    return throwError(() => new Error('Login failed. Please check your credentials or contact support.'));
  }


}*/