import { HttpClient, HttpHeaders, HttpParams  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { VQuoHdrList } from '../Models/VQuoHdrList';
import { QuotationHdr } from '../Models/QuotationHdr';
import { DtoQuoByProduct } from '../Models/DtoQuoByProduct';
import { QuotationDetail } from '../Models/QuotationDetail';
import { SellerResponse } from '../Models/seller-response.model';
import { InquirySummary } from '../Models/InquirySummary';
import { ManualSellerResponse } from '../Models/ManualSellerResponse';
import { InquirymanualSummary } from '../Models/InquirymanualSummary';

@Injectable({
  providedIn: 'root'
})
export class ServQuoService {
 private baseUrl = 'http://193.111.124.45:9815/mc-svc/main/';
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

  QuoList(): Observable<any>{
      return this.http.get<Array<VQuoHdrList>>("http://193.111.124.45:9815/wc-svc/quo/getQuoListAll", {withCredentials: true });  
    }
  
    QuoManualListByUser(userid:string, status:string, approve:string,  tkn:string): Observable<any>{
    const headers = this.getHeaders(tkn);
      return this.http.get<Array<VQuoHdrList>>("http://193.111.124.45:9815/wc-svc/quo/getQuoListByUserId?userid="+userid+"&status="+status+"&approve="+approve, {withCredentials: true });  
  }

  getQuoListByIdUser(userid:string, quoid:string, tkn:string): Observable<any>{
    const headers = this.getHeaders(tkn);
      return this.http.get<Array<QuotationHdr>>("http://193.111.124.45:9815/wc-svc/quo/getquobyidcuscode?quoid="+quoid+"&cuscode="+userid, {withCredentials: true });  
    }
  
  
  QuoSaveHdr(data:any):Observable<any>{   
      return this.http.post("http://193.111.124.45:9819/wc-svc/quo/saveQuotation",data, {responseType: 'text' as 'text', withCredentials: true});
     }
  
   createQuoHdr(userid: string, data: QuotationDetail, file1: File, file2: File): Observable<any> {
     //alert("tttttttttttt : "+file1.name+" ---- "+file2.name);
    const formData = new FormData();
   
    formData.append('userid', userid);
    formData.append('ptype', "W");
    formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
   
    if (file1) { formData.append('file1', file1); }
    if (file2) { formData.append('file2', file2); }

   // console.log("aaaaaaaaaaa :"+JSON.stringify(formData))
  
    return this.http.post('http://193.111.124.45:9815/wc-svc/quo/saveQuotation',  formData, {responseType: 'text' as 'text', withCredentials: true});
  }
  
  //===================================quotation by product===================================

  QuoListByUser (userid:string, status:string, approve:string, tkn:string): Observable<any>{
        const headers = this.getHeaders(tkn);
          return this.http.get<Array<VQuoHdrList>>("http://193.111.124.45:9815/wc-svc/quo/getQuoListByUserIdprod?userid="+userid+"&status="+status+"&approve="+approve, {withCredentials: true });  
  }

  QuoListByQuoidUser (quoid:string, userid:string, tkn:string): Observable<any>{
    const headers = this.getHeaders(tkn);
      return this.http.get<Array<DtoQuoByProduct>>(" http://193.111.124.45:9815/wc-svc/webcust/getquotationtList?CtqdId="+quoid+"&userid="+userid, {withCredentials: true });
  }

  QuoListByQuoi (quoid:string,  tkn:string): Observable<any>{
    const headers = this.getHeaders(tkn);
      return this.http.get<Array<QuotationDetail>>("http://193.111.124.45:9815/wc-svc/webcust/getCtqdListByCtqhId?CtqhId="+quoid, {withCredentials: true });
  }

  QuoDtlSingle (quoid:string, no:string, tkn:string): Observable<any>{
    const headers = this.getHeaders(tkn);
      return this.http.get<Array<QuotationDetail>>("http://193.111.124.45:9815/wc-svc/webcust/getQuoDtl?ctqdCtqhId="+quoid+"&ctqdId="+no, {withCredentials: true });
  }

  getImagesquoHdr(custNo: string, quono: string, usr:string, tkn:string): Observable<string[]> {
    const url = `http://193.111.124.45:9815/wc-svc/images/${usr}/QUOTATIONSH/${quono}`;
    const headers = this.getHeaders(tkn);
    return this.http.get<string[]>(url, {withCredentials: true });
  }

  getImagesquo(custNo: string, quono: string, no: string, usr:string, tkn:string): Observable<string[]> {
    const url = `http://193.111.124.45:9815/wc-svc/images/${usr}/QUOTATIONS/${quono}?no=${no}`;
    const headers = this.getHeaders(tkn);
    return this.http.get<string[]>(url, {withCredentials: true });
  }

  createQuoWeb(userid: string, data: QuotationDetail, file1: File, file2: File, file3: File, file4: File): Observable<any> {
    const formData = new FormData();
    formData.append('userid', userid);
    formData.append('ptype', "W");
    formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
   
    if (file1) { formData.append('file1', file1); }
    if (file2) { formData.append('file2', file2); }
    if (file3) { formData.append('file3', file3); }
    if (file4) { formData.append('file4', file4); }
  
    return this.http.post('http://193.111.124.45:9815/wc-svc/webcust/savequodtl',  formData, {responseType: 'text' as 'text', withCredentials: true});
  }

  UpdateQuoWeb(id: string, userid: string, NoQuo:string, data: QuotationDetail, file1: File, file2: File, file3: File, file4: File): Observable<any> {
    const formData = new FormData();
    formData.append('id', id);
    formData.append('userid', userid);
    formData.append('NoQuo', NoQuo);
    formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
  
    if (file1) { formData.append('file1', file1); }
    if (file2) { formData.append('file2', file2); }
    if (file3) { formData.append('file3', file3); }
    if (file4) { formData.append('file4', file4); }
   // const headers = this.getHeaders(tkn);
    return this.http.post('http://193.111.124.45:9815/wc-svc/webcust/UpdateQuobyProduct',  formData, {responseType: 'text' as 'text',withCredentials: true});
  }
 


  //--------------------------------result inquiry-----------------------------------

/*
  private getResultInquiry(params: HttpParams, endpoint: string): Observable<InquiryResult[]> {
    const baseUrl = 'http://193.111.124.45:9815/mc-svc/main/';
    return this.http.get<InquiryResult[]>(baseUrl + endpoint, { params });
  }

  // API untuk tab "Best Match" (Fulfill)
  getResultByFulfillment(custNo: string, quoNo: string): Observable<InquiryResult[]> {
    const params = new HttpParams()
      .set('CustNo', custNo)
      .set('QuoNo', quoNo)
      .set('Fulfill', 'Y');
    return this.getResultInquiry(params, 'getResultDetailListbyCustAndQuoAndType');
  }                                       
  
  // API untuk tab "By Price"
  getResultByPrice(custNo: string, quoNo: string, type: string = 'P'): Observable<InquiryResult[]> {
    const params = new HttpParams()
      .set('CustNo', custNo)
      .set('QuoNo', quoNo)
      .set('Type', type);
    return this.getResultInquiry(params, 'getResultPriceListbyCustAndQuoAndType');
  }                                
    getResultByRegion(custNo: string, quoNo: string, type: string = 'P'): Observable<InquiryResult[]> {
    const params = new HttpParams()
      .set('CustNo', custNo)
      .set('QuoNo', quoNo)
      .set('Type', type);
    return this.getResultInquiry(params, 'getResultRegionListbyCustAndQuoAndType');
  }
*/
/* --------------------------seller quotation response by catalog-------------------------- */
  getInquiryListByproduct(custNo: string, status: string = 'All'): Observable<InquirySummary[]> {
    const baseUrl = 'http://193.111.124.45:9815/mc-svc/main/getResultProductByCustNoList';
    
    const params = new HttpParams().set('CustNo', custNo);
    
    return this.http.get<InquirySummary[]>(baseUrl, { params });
  }

   getResultByFulfillment(custNo: string, quoNo: string): Observable<SellerResponse[]> {
    const params = new HttpParams().set('CustNo', custNo).set('QuoNo', quoNo).set('Type', 'P').set('Respon', 'P').set('Fulfill', 'Y');
    return this.http.get<SellerResponse[]>(this.baseUrl + 'getResultDetailListbyCustAndQuoAndType', { params });

  }
  
  getResultByPrice(custNo: string, quoNo: string, type: string = 'P'): Observable<SellerResponse[]> {
    const params = new HttpParams().set('CustNo', custNo).set('QuoNo', quoNo).set('Type', type);
    return this.http.get<SellerResponse[]>(this.baseUrl + 'getResultPriceListbyCustAndQuoAndType', { params });
  }

  getResultByRegion(custNo: string, quoNo: string, type: string = 'P'): Observable<SellerResponse[]> {
    const params = new HttpParams().set('CustNo', custNo).set('QuoNo', quoNo).set('Type', type);
    return this.http.get<SellerResponse[]>(this.baseUrl + 'getResultRegionListbyCustAndQuoAndType', { params });
  }

   getResultByManual(custNo: string, quoNo: string, type: string = 'P', respon: string = 'M'): Observable<ManualSellerResponse[]> {
    const params = new HttpParams()
      .set('CustNo', custNo)
      .set('QuoNo', quoNo)
      .set('Type', type)
      .set('Respon', respon);
    return this.http.get<ManualSellerResponse[]>(this.baseUrl + 'getResultDetailManualListbyCustAndQuoAndType', { params });
  }

  /* --------------------------seller quotation response manual-------------------------- */
  getInquiryListBymanual(custNo: string, status: string = 'All'): Observable<InquirymanualSummary[]> {
    const baseUrl = 'http://193.111.124.45:9815/mc-svc/main/getResultManualByCustNoList';
    
    const params = new HttpParams().set('CustNo', custNo);
    
    return this.http.get<InquirymanualSummary[]>(baseUrl, { params });
  }

   getResultByFulfillmentmanua(custNo: string, quoNo: string): Observable<SellerResponse[]> {
    const params = new HttpParams().set('CustNo', custNo).set('QuoNo', quoNo).set('Type', 'M').set('Respon', 'P');
    return this.http.get<SellerResponse[]>(this.baseUrl + 'getResultDetailListbyCustAndQuoAndType', { params });

  }
  
  getResultByPricemanual(custNo: string, quoNo: string, type: string = 'M'): Observable<SellerResponse[]> {
    const params = new HttpParams().set('CustNo', custNo).set('QuoNo', quoNo).set('Type', type);
    return this.http.get<SellerResponse[]>(this.baseUrl + 'getResultPriceListbyCustAndQuoAndType', { params });
  }

  getResultByRegionmanual(custNo: string, quoNo: string, type: string = 'M'): Observable<SellerResponse[]> {
    const params = new HttpParams().set('CustNo', custNo).set('QuoNo', quoNo).set('Type', type);
    return this.http.get<SellerResponse[]>(this.baseUrl + 'getResultRegionListbyCustAndQuoAndType', { params });
  }

   getResultByManualmanual(custNo: string, quoNo: string, type: string = 'M'): Observable<ManualSellerResponse[]> {
    const params = new HttpParams()
      .set('CustNo', custNo)
      .set('QuoNo', quoNo)
      .set('Type', type)
      .set('Respon', 'M');
    return this.http.get<ManualSellerResponse[]>(this.baseUrl + 'getResultDetailManualListbyCustAndQuoAndType', { params });
  }

    getImgBannerType(type: String): Observable<string[]> {
    const url = `http://193.111.124.45:9816/appmst-svc/images/banTypeImgbyType?type=` + type;
    return this.http.get<string[]>(url);
  }
}
