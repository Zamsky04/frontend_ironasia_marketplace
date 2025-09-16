import { Injectable } from '@angular/core';
import { CustGeneral } from '../Models/CustGeneral';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImageResponse } from '../Models/ImageResponse';

// ✅ Tambahkan di sini, sebelum @Injectable

@Injectable({
  providedIn: 'root'
})
export class CustProfileServService {

  private getHeaders(tkn: string): HttpHeaders {
      if (tkn) {
        return new HttpHeaders({
          'Authorization': `Bearer ${tkn}`
        });
      } else {
        return new HttpHeaders();
      }
    }
    

  constructor(private http: HttpClient) { }

  getListByCustNo(pcust: string, tkn: string): Observable<any> {
      const headers = this.getHeaders(tkn);
      return this.http.get<Array<CustGeneral>>("http://193.111.124.45:9816/am-svc/webadmin/getCustListCustNo?custno=" + pcust, { headers });
    }
  
  getImages(no: string): Observable<string[]> {
    const url = `http://193.111.124.45:9816/am-svc/images/CustImgById?no=` + no;
    return this.http.get<string[]>(url);
  }

  UpdateCustgen(id: string, userid: string, data: CustGeneral, file1: File, tkn: string): Observable<string> {
      const headers = this.getHeaders(tkn);
      const formData = new FormData();
      formData.append('id', id);
      formData.append('userid', userid);
      formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  
      if (file1) { formData.append('file1', file1); }
  
      return this.http.post('http://193.111.124.45:9816/am-svc/webadmin/UpdateCustgen', formData, {
        headers,
        responseType: 'text'  // ✅ pastikan response diterima sebagai plain text
      });
    }

 /*   getImagesSingle(pcustno: string, pnik: string): Observable<string[]> {
    const url = `http://193.111.124.45:9816/mc-svc/main/getCustPhotoList?CustNo=` + pcustno +'&Nik='+pnik;
    return this.http.get<string[]>(url);
  }*/

  // ✅ Ubah tipe Observable agar sesuai dengan struktur JSON
  getImagesSingle(pcustno: string, pnik: string): Observable<ImageResponse[]> {
    const url = `http://193.111.124.45:9816/mc-svc/main/getCustPhotoList?CustNo=${pcustno}&Nik=${pnik}`;
    return this.http.get<ImageResponse[]>(url);
  }

}
