import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { DtoMainProdList } from '../Components/DtoMainProdList';
import { dtoProductType } from '../Models/dtoProductType';
import { SupplierContact } from '../Models/SupplierContact';

@Injectable({
  providedIn: 'root'
})
export class MainHomeServService {

  private getHeaders(tkn:string): HttpHeaders { 
    if (tkn) {
      return new HttpHeaders({
        'Authorization': `Bearer ${tkn}`
      });
    } else {
      return new HttpHeaders();
    }
  }

  constructor(private http: HttpClient) { }

   mainProdList(): Observable<any>{
        return this.http.get<Array<DtoMainProdList>>("http://193.111.124.45:9815/wc-svc/main/getMainProduct", {withCredentials: true });  
    }

    mainProdidList(prodid:number): Observable<any>{
      return this.http.get<Array<DtoMainProdList>>("http://193.111.124.45:9815/wc-svc/webcust/getWebproductsid?prodid="+prodid, {withCredentials: true });  
    }

    mainProdidListFilter(prodid:number, ProdTypeId:number, provid:any, cityid:any, area:any, Price:number): Observable<any>{
      return this.http.get<Array<DtoMainProdList>>("http://193.111.124.45:9815/wc-svc/webcust/getWebproductsidfilter?prodid="+prodid+"&ProdTypeId="+ProdTypeId+"&provid="+provid+"&cityid="+cityid+"&area="+area+"&Price="+Price, {withCredentials: true });  
    }

     mainProdidandProdtypeIdList(prodid:number, prodtyid:string): Observable<any>{
      return this.http.get<Array<DtoMainProdList>>("http://193.111.124.45:9815/wc-svc/webcust/getWebproductsidandprodtyid?prodid="+prodid+"&prodtyid="+prodtyid, {withCredentials: true });  
    }


     mainBannerList(): Observable<string[][]> {
        return this.http.get<string[][]>("http://193.111.124.45:9815/appmst-svc/banners/getbanner", {withCredentials: true });
    }

     mainProdtypeidList(prodid:number): Observable<any>{
      return this.http.get<Array<dtoProductType>>("http://193.111.124.45:9815/mc-svc/main/getProdTypeListByProdCode?ProdCode="+prodid, {withCredentials: true });  
    }

     mainSearchPage(product:string): Observable<any>{
      return this.http.get<Array<any>>("http://193.111.124.45:9815/mc-svc/main/getWebProductBySearchMatchList?p_search="+product, {withCredentials: true });  
    }

    mainHotDealsList(): Observable<any>{
      return this.http.get<Array<any>>("http://193.111.124.45:9815/mc-svc/main/getHotDealsList", {withCredentials: true });  
    }

    mainNewArrivalList(): Observable<any>{
      return this.http.get<Array<any>>("http://193.111.124.45:9815/mc-svc/main/getNewArrivalList", {withCredentials: true });  
    }

    mainTopRaking(): Observable<any>{
      return this.http.get<Array<any>>("http://193.111.124.45:9815/mc-svc/main/getTopRankingList", {withCredentials: true });  
    }

    mainCoreBussiness(custno:string): Observable<any>{
      return this.http.get<Array<any>>("http://193.111.124.45:9815/mc-svc/main/getWebCoreBussList?ccustNo="+custno, {withCredentials: true });  
    }

    mainNotifikasi(custno:string): Observable<any>{
      return this.http.get<Array<any>>("http://193.111.124.45:9815/am-svc/webadmin/getCnotifByUserSts?usr="+custno+"&sts=N", {withCredentials: true });  
    }

   // updateNotifikasi(notif:any, userid:any): Observable<any>{
    //  return this.http.get<string>("http://193.111.124.45:9815/am-svc/webadmin/ProcUpdNotif?p_notifid="+notif+"&p_user="+userid);
  // }

  updateNotifikasi(notifId: string, userId: string): Observable<string> {     
    const apiUrl = "http://193.111.124.45:9815/mc-svc/main/callProcessUpdNotif";    
    const body = {
        userid: userId,
        notifid: notifId
    };
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }), 
      responseType: 'text' as 'json' ,
      withCredentials: true  
    };
    return this.http.post<string>(apiUrl, body, httpOptions);
  }  

  

 private apiUrl = "http://193.111.124.45:9815/mc-svc/main/getContactBySuppNoList";
 getContact(suppNo: string): Observable<SupplierContact[]> {
    const params = new HttpParams().set('SuppNo', suppNo);
    return this.http.get<SupplierContact[]>(this.apiUrl, { params });
  }

  
    mainAbout(): Observable<string> {
    const url = "http://193.111.124.45:9815/appmst-svc/main/getRedakDesc?type=ABT";
    return this.http.get(url, { responseType: 'text' }); 
    }
    
    mainHelp(): Observable<string> {
    const url = "http://193.111.124.45:9815/appmst-svc/main/getRedakDesc?type=NDH";
    return this.http.get(url, { responseType: 'text' }); 
    }

    mainRfq(): Observable<string> {
    const url = "http://193.111.124.45:9815/appmst-svc/main/getRedakDesc?type=RFQ";
    return this.http.get(url, { responseType: 'text' }); 
  }

 private apiUrl2 = 'http://193.111.124.45:9815';

forgotPassword(email: string): Observable<string> {
  const endpoint = `${this.apiUrl2}/wc-svc/forgot-password`;
  
  // Data yang akan dikirim dalam body
  const body = { email: email }; 

  const httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
    responseType: 'text' as 'json' // Cukup 'text' jika responsnya string
  };
  
  return this.http.post<string>(endpoint, body, httpOptions)
    .pipe(
      catchError(this.handleError)
    );
}

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.error);
    return throwError(() => new Error(error.error || 'Something bad happened; please try again later.'));
  }

  download(filename: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl2}/wc-svc/download/${filename}`, {
      // Opsi ini krusial: memberitahu Angular untuk menerima data biner.
      responseType: 'blob' 
    });
  }

  resetPassword(passkey: string, newPassword: string): Observable<string> {
    const endpoint = `${this.apiUrl2}/am-svc/reset-password`; // Sesuai dengan endpoint di Spring Boot
    const body = {
      passkey: passkey,
      newPassword: newPassword
    };
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: 'text' as 'json' // Respons diharapkan berupa teks biasa
    };
    return this.http.post<string>(endpoint, body, httpOptions).pipe(
      catchError(this.handleError)
    );
  }

     
}
