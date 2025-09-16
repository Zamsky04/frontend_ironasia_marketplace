import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './services/auth.service';


export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: any) => {
      // Periksa apakah error adalah HttpErrorResponse dengan status 401
      if (error instanceof HttpErrorResponse && error.status === 401) {
        
        console.log('Sesi kedaluwarsa atau tidak valid. Melakukan logout...');
        
        // Panggil method logout di AuthService
        authService.execLogout();
        
        // Arahkan pengguna ke halaman login
      //  router.navigate(['/login'], {
          // Opsional: tambahkan pesan di query params
       //   queryParams: { sessionExpired: 'true' }
       // });
      }
      
      // Teruskan error ke pemanggil asli
      return throwError(() => error);
    })
  );
};