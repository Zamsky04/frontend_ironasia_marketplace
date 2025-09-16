import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { loginresponse } from '../login/Models/loginresponse';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Ganti URL ini dengan alamat API Gateway Anda
  private apiUrl = "http://193.111.124.45:9815"; 
  

  // --- Bagian State Management ---
  
  // Menyimpan status login (true/false)
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  // Menyimpan data user yang sedang login
  private currentUserSubject = new BehaviorSubject<loginresponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) { }

  // --- Method untuk Mengubah State ---

  /**
   * Mengubah status login dan data user. 
   * Dipanggil dari Login Component setelah login berhasil.
   */
  public setLoggedIn(status: boolean, user: loginresponse | null): void {
    this.isLoggedInSubject.next(status);
    this.currentUserSubject.next(user);
  }

  /**
   * Getter untuk pengecekan status login secara langsung (berguna untuk AuthGuard).
   */
  public get isLoggedIn(): boolean {
    return this.isLoggedInSubject.getValue();
  }

  // --- Bagian API Calls ---

  /**
   * Memanggil API login.
   */
  execLogin(userid: string, userpass: string, macaddress: string): Observable<loginresponse> {
    const loginUrl = `${this.apiUrl}/auth/login`;
    const body = { userid, userpass, macaddress };

    return this.http.post<loginresponse>(loginUrl, body, {
      withCredentials: true
    }).pipe(
      tap(response => {
        // Setelah login berhasil, langsung update state di sini
        this.setLoggedIn(true, response);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Memanggil API logout.
   */
  execLogout(): void {
    const logoutUrl = `${this.apiUrl}/auth/logout`;
    
    // Panggil API logout untuk membersihkan cookie di server
    this.http.post(logoutUrl, {}, { withCredentials: true }).subscribe({
      next: () => console.log('Logout API call successful'),
      error: err => console.error('Logout API call failed', err)
    });

    // Langsung reset state di frontend tanpa menunggu respons API
    this.setLoggedIn(false, null);
  }

  private handleError(error: HttpErrorResponse) {
    console.error(`Backend returned code ${error.status}, body was: `, error.error);
    return throwError(() => new Error('Login gagal. Periksa kredensial Anda atau hubungi support.'));
  }

    public checkTokenValidity(): Observable<boolean> {
    const validationUrl = `${this.apiUrl}/auth/validate-token`;

    return this.http.get(validationUrl, { responseType: 'text', withCredentials: true }).pipe(
      
      map((response: string) => {
        console.log('Respons mentah dari API:', response);
             if (response && response.includes('Token is valid')) {
          return false;
        } else {
          return true;
        }
      }),
      
      catchError((error: any) => {
        // Blok ini sekarang hanya akan berjalan jika ada error jaringan,
        // misalnya server mati atau tidak ada koneksi internet.
        console.error('Terjadi error jaringan saat validasi token:', error);
        return of(true); // Anggap expired jika koneksi gagal
      })
    );
  }


}