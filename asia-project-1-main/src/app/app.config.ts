import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';
import { HttpClient, provideHttpClient, withInterceptors, withXsrfConfiguration } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from './login/Services/auth-service.service';
import { loginresponse } from './login/Models/loginresponse';
import { catchError, Observable, of, tap } from 'rxjs';
;

export function initializeApp(http: HttpClient, authService: AuthService): () => Observable<any> {
  return () => http.get<loginresponse>('/api/auth/validate-token', { withCredentials: true }).pipe(
    tap(user => {
      // Jika request berhasil, artinya cookie valid
      authService.setLoggedIn(true, user);
    }),
    catchError(() => {
      // Jika error (misal 401), artinya cookie tidak valid atau tidak ada
      authService.setLoggedIn(false, null);
      return of(null); // Kembalikan observable agar aplikasi tetap berjalan
    })
  );
}

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideAnimations(),   
    provideHttpClient(
      withInterceptors([authInterceptor]),
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN',
      })
    ),
    providePrimeNG({ 
    theme: {
        preset: Aura
    }
}), provideAnimationsAsync(),  provideHttpClient(), provideAnimationsAsync(),
provideHttpClient() ,
provideHttpClient(withInterceptors([authInterceptor])) 
    ]
};
