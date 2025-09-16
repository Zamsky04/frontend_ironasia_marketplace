import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DtoAddress } from '../Models/DtoAddress';
import { CustAddress } from '../Models/CustAddress';
import { VCustAddress } from '../Models/VCustAddress';
import { citymdl } from '../../../Registration/Models/citymdl';
import { kecamatanmdl } from '../../../Registration/Models/kecamatanmdl';
import { kelurahanmdl } from '../../../Registration/Models/kelurahanmdl';
import { provincemdl } from '../../../Registration/Models/provincemdl';

@Injectable({
  providedIn: 'root'
})
export class CustAddressServService {

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

  getAddressListByCustNo(pcust: string, tkn: string): Observable<any> {
    const headers = this.getHeaders(tkn);
    return this.http.get<Array<VCustAddress>>("http://193.111.124.45:9816/am-svc/webadmin/getVAddrListByCust?&cust_no=" + pcust, { headers });
  }

  getAddrSingle(paddrid: any ,pcust: string, tkn: string): Observable<any> {
    const headers = this.getHeaders(tkn);
    return this.http.get<Array<CustAddress>>("http://193.111.124.45:9816/am-svc/webadmin/getAddrCustSingle?&addrid=" + paddrid + "&cust_no=" + pcust , { headers });
  }

  /*DeleteAddress(data : DtoAddress , tkn: string): Observable<any> {
      const headers = this.getHeaders(tkn);
      return this.http.delete<Array<CustAddress>>("http://193.111.124.45:9816/am-svc/webadmin/delete?" + data, { headers });
    }*/
  getProvinceALL(): Observable<any> {
    return this.http.get<Array<provincemdl>>("http://193.111.124.45:9816/appmst-svc/main/getCmpsiListAll");
  }

  getcitybyprovALL(provcode: string): Observable<any> {
    return this.http.get<Array<citymdl>>("http://193.111.124.45:9816/appmst-svc/main/getCmcitListByProvCode?ProvCode=" + provcode);
  }

  getKecbyCityALL(citycode: string): Observable<any> {
    return this.http.get<Array<kecamatanmdl>>("http://193.111.124.45:9816/appmst-svc/main/getCmkecListByCityCode?CityCode=" + citycode);
  }

  getKelbyKecALL(keccode: string): Observable<any> {
    return this.http.get<Array<kelurahanmdl>>("http://193.111.124.45:9816/appmst-svc/main/getCmkelListByKecCode?KecCode=" + keccode);
  }

  SaveUpdateAddr(data: CustAddress, tkn: string): Observable<string> {
    const headers = this.getHeaders(tkn);
    return this.http.post('http://193.111.124.45:9816/am-svc/webadmin/saveupdAddr', data, {
      headers,
      responseType: 'text'  // ✅ pastikan response diterima sebagai plain text
    });
  }

  DeleteAddress(data: DtoAddress, tkn: string): Observable<string> {
    const headers = this.getHeaders(tkn);
    return this.http.post(
      "http://193.111.124.45:9816/am-svc/webadmin/deleteAddr",
      data,
      {
        headers,
        responseType: 'text' // ⬅️ Ini WAJIB agar Angular tidak salah parse
      }
    );
  }



}
