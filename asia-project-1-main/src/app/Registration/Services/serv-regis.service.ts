import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { provincemdl } from '../Models/provincemdl';
import { citymdl } from '../Models/citymdl';
import { kecamatanmdl } from '../Models/kecamatanmdl';
import { kelurahanmdl } from '../Models/kelurahanmdl';
import { loginreponse } from '../Models/loginreponse';

@Injectable({
  providedIn: 'root'
})
export class ServRegisService {


  constructor(private http: HttpClient) { }

  private getHeaders(tkn:string): HttpHeaders {
   
    if (tkn) {
      return new HttpHeaders({
        'Authorization': `Bearer ${tkn}`
      });
    } else {
      return new HttpHeaders();
    }
  }
  
  getProvinceALL(): Observable<any>{
    return this.http.get<Array<provincemdl>>("http://193.111.124.45:9815/appmst-svc/main/getCmpsiListAll");  
  }
RegistrationId(): Observable<any>{
    return this.http.get<Array<provincemdl>>("http://193.111.124.45:9815/appmst-svc/main/getCmpsiListAll");  
  }

  getcitybyprovALL(provcode:string): Observable<any>{
    return this.http.get<Array<citymdl>>("http://193.111.124.45:9815/appmst-svc/main/getCmcitListByProvCode?ProvCode="+provcode);  
  }

  getKecbyCityALL(citycode:string): Observable<any>{
    return this.http.get<Array<kecamatanmdl>>("http://193.111.124.45:9815/appmst-svc/main/getCmkecListByCityCode?CityCode="+citycode);  
  }

  getKelbyKecALL(keccode:string): Observable<any>{
    return this.http.get<Array<kelurahanmdl>>("http://193.111.124.45:9815/appmst-svc/main/getCmkelListByKecCode?KecCode="+keccode);  
  }

  execLogin(userid:string, userpass:string, macaddress:string, pmsg:string): Observable<any>{    
    
    return this.http.get<loginreponse>("http://193.111.124.45:9815/appmst-svc/webadmin/exeLogin?userid="+userid+"&userpass="+userpass+"&macaddress="+macaddress);
    
  }

  getRegId(): Observable<any>{
    return this.http.get<Array<number>>("http://193.111.124.45:9815/wc-svc/reg/getregid");  
  }  
  
  saveupdateRegis(data:any,  file1: File, file2: File):Observable<any>{ 
    const formData = new FormData();
    //alert("json format : "+JSON.stringify(data));
    console.log("json format : "+JSON.stringify(data));
    formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
   
    if (file1) { formData.append('file1', file1); }
    if (file2) { formData.append('file2', file2); }
    return this.http.post("http://193.111.124.45:9815/am-svc/reg/saveupdreg",formData, {responseType: 'text' as 'text'});
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

   sendOtp(to: string, subject: string): Observable<string> {
    const body = {
      to: to,
      subject: subject
    };

    return this.http.post("http://193.111.124.45:9815/wc-svc/reg/sendemail", body, { responseType: 'text' as 'text' });
    }


}

