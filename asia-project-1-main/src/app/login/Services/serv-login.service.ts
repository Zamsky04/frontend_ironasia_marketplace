import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, Subject} from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as CryptoJS from 'crypto-js';
import { loginresponse } from '../Models/loginresponse';


export interface TokenResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServLoginService {

  private callMethodSource = new Subject<void>();
  callMethodObservable = this.callMethodSource.asObservable();

  private callMethodSourcenavbar = new Subject<void>();
  callMethodObservablenavbar = this.callMethodSourcenavbar.asObservable();

  private callMethodSourceMain = new Subject<void>();
  callMethodObservableMain = this.callMethodSourceMain.asObservable();

  private callMethodSourceHeaderbarlogout = new Subject<void>();
  callMethodObservablenavbarlogout = this.callMethodSourceHeaderbarlogout.asObservable();
  
  private resultSource = new BehaviorSubject<string>(''); // Observable untuk hasil
  result$ = this.resultSource.asObservable();

  private variableSource2 = new BehaviorSubject<string>('My Account');
  currentVariable$ = this.variableSource2.asObservable();

  private variableSource3 = new BehaviorSubject<string>('assets/user.png');
  currentVariable3$ = this.variableSource3.asObservable();

  private apiUrl = "http://193.111.124.45:9815";
  

  constructor(private http: HttpClient) { }

  execLogin(userid: string, userpass: string, macaddress: string): Observable<TokenResponse> {
  const loginUrl = `${this.apiUrl}/auth/login`;
  const params = new HttpParams()
    .set('userid', userid)
    .set('userpass', userpass)
    .set('macaddress', macaddress);

  const headers = new HttpHeaders({
    'Content-Type': 'application/x-www-form-urlencoded'
  });

  return this.http.post<TokenResponse>(loginUrl, params.toString(), { headers: headers })
    .pipe(catchError(this.handleError2));
}

  private handleError2(error: HttpErrorResponse) {
    console.error(`Backend returned code ${error.status}, body was: `, error.error);
    return throwError(() => new Error('Login failed. Please check your credentials.'));
  }




  execLogin_asal(userid:string, userpass:string, macaddress:string, pmsg:string): Observable<any>{ 
    
    return this.http.get<loginresponse>("http://193.111.124.45:9815/am-svc/webadmin/exeLogin?userid="+userid+"&userpass="+userpass+"&macaddress="+macaddress)
    .pipe(
      catchError(this.handleError)
    );    
  }

   private handleError(error: any) {
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      console.error('An error occurred:', error.error.message);
      return throwError(() => new Error('Something bad happened; please try again later.'));
    } else {
      // Server-side error
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
       return throwError(() => new Error('Something bad happened; please try again later.'));
    }
  }
  
  secretKey: string="12!@#$%abgz123";
  
  encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, this.secretKey).toString();
  }

  // Metode untuk dekripsi
  decrypt(ciphertext: string): string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, this.secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  updatemyacc(value: string) {
    this.variableSource2.next(value);
  }

  updatemyppc(value: string) {
    this.variableSource3.next(value);
  }



  // Method yang akan dipanggil oleh komponen lain untuk memicu pemanggilan
  callmethodfromothercomponent() {  
    this.callMethodSource.next();
  }

  callmethodfromothercomponentnavbar() {  
    this.callMethodSourcenavbar.next();
  }

   callmethodfromothercomponentheaderbarlogout() {  
    this.callMethodSourceHeaderbarlogout.next();
  }

   callmethodfromothercomponentMain() {  
    this.callMethodSourceMain.next();
  }

  // Contoh method lain yang bisa ada di service
  getData(): string {

    return 'Data dari service';
  }

}

