import { Injectable } from '@angular/core';
import { DtoVerifyCust } from '../Models/DtoVerifyCust';
import { DtoUpdCustPwd } from '../Models/DtoUpdCustPwd';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServChangePasswordWebService {

  private getHeaders(tkn: string): HttpHeaders {
          if (tkn) {
            return new HttpHeaders({
              'Authorization': `Bearer ${tkn}`
            });
          } else {
            return new HttpHeaders();
          }
        }

  constructor(private http:HttpClient) { }

  ProcVerifyCust(data: DtoVerifyCust, tkn: string): Observable<string> {
    const headers = this.getHeaders(tkn);
    return this.http.post("http://193.111.124.45:9816/am-svc/webadmin/ProcVerifyCust?", data, {
      headers,
      responseType: 'text' // 👉 ini penting biar gak parsing JSON
    });
  }
  
  
    ProcUpdCustPwd(data: DtoUpdCustPwd, tkn: string): Observable<string> {
    const headers = this.getHeaders(tkn);
    return this.http.post("http://193.111.124.45:9816/am-svc/webadmin/ProcUpdCustPwd?", data, {
      headers,
      responseType: 'text' // 👉 ini penting biar gak parsing JSON
    });
  }

}
