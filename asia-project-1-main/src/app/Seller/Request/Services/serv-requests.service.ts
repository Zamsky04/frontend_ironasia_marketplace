import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DTORequestList } from '../Models/DTORequestList';
import { RequestDtl } from '../Models/RequestDtl';
import { vrequestlist } from '../Models/vrequestlist';
import { quotationmanual } from '../../models/quotationmanual';
import { quotationproduct } from '../../models/quotationproduct';
import { quotationmanualdetail } from '../../models/quotationmanualdetail';
import { catalogproduct } from '../../models/catalogproduct ';
import { QuotationByProductDetail } from '../../models/QuotationByProductDetail ';
import { DTOSaveManual } from '../../models/DTOSaveManual';
import { DTOSaveManualProduct } from '../../models/DTOSaveManualProduct';
import { DTOSavePickProduct } from '../../models/DTOSavePickProduct';
import { SellerCatalogProduct } from '../../models/SellerCatalogProduct';
import { DtoExePickProd } from '../Models/DtoExePickProd';
import { DtoExeGetContact } from '../Models/DtoExeGetContact';
import { DTOProductDetailBlast } from '../../models/DTOProductDetailBlast';

@Injectable({
  providedIn: 'root'
})
export class ServRequestsService  {
  
  curDate=new Date();
constructor(private http: HttpClient) { }
/*
private getHeaders(tkn:string): HttpHeaders { 
  if (tkn) {
    return new HttpHeaders({
      'Authorization': `Bearer ${tkn}`
    });
  } else {
    return new HttpHeaders();
  }
}*/

getAllReqEc(sr:string, tkn:string): Observable<RequestDtl[]> {
 // const headers = this.getHeaders(tkn);
  return this.http.get<RequestDtl[]>("http://193.111.124.45:9815/wc-svc/webcust/getCtecdListAll",  { withCredentials: true }  );
}

getReqEcById(req: string, sr:string, tkn:string): Observable<any> {
  //const headers = this.getHeaders(tkn);
  return this.http.get<Array<RequestDtl>>("http://193.111.124.45:9815/wc-svc/webcust/getCtecdListByCtechId?CtechId="+req,  { withCredentials: true });
}

getReqList(req: string,  usr:string, tkn:string): Observable<any> {
 // const headers = this.getHeaders(tkn);
  
  return this.http.get<Array<DTORequestList>>("http://193.111.124.45:9815/wc-svc/webcust/getRequestList?CtechId="+req+"&userid="+usr, { withCredentials: true } );
}

getReqEcByIdNo(req: string, no: string, sr:string, tkn:string): Observable<any> {
  //const headers = this.getHeaders(tkn);
  return this.http.get<Array<RequestDtl>>("http://193.111.124.45:9815/wc-svc/webcust/getCtecdListByCtechIdAndCtecdId?CtechId="+req+"&CtecdId="+no, { withCredentials: true });
}

getVReqByuser(usr:string, stat:string): Observable<vrequestlist[]> {
  const url = "http://193.111.124.45:9815/wc-svc/webcust/getVReqByUserStatus";
  
  // Buat parameter secara terpisah
  const params = new HttpParams()
    .set('usr', usr)
    .set('Stat', stat); // 'Stat' dengan S besar sesuai URL Anda

  // Masukkan params ke dalam objek opsi
  return this.http.get<vrequestlist[]>(url, { 
    params: params, 
    withCredentials: true 
  });
}

createReqWeb(userid: string, data: RequestDtl, file1: File, file2: File, file3: File, file4: File): Observable<any> {
  const formData = new FormData();
  formData.append('userid', userid);
  formData.append('ptype', "W");
    formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
 
  if (file1) { formData.append('file1', file1); }
  if (file2) { formData.append('file2', file2); }
  if (file3) { formData.append('file3', file3); }
  if (file4) { formData.append('file4', file4); }

  return this.http.post('http://193.111.124.45:9815/wc-svc/webcust/saveupdreqecdtl',  formData, {responseType: 'text' as 'text', withCredentials: true});
}


UpdateReqWeb(id: string, userid: string, NoRequest:string, data: RequestDtl, file1: File, file2: File, file3: File, file4: File): Observable<any> {
  const formData = new FormData();
  formData.append('id', id);
  formData.append('userid', userid);
  formData.append('NoRequest', NoRequest);
  formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));

  if (file1) { formData.append('file1', file1); }
  if (file2) { formData.append('file2', file2); }
  if (file3) { formData.append('file3', file3); }
  if (file4) { formData.append('file4', file4); }
 // const headers = this.getHeaders(tkn);
  return this.http.post('http://193.111.124.45:9815/wc-svc/webcust/UpdateRequest',  formData, {responseType: 'text' as 'text', withCredentials: true});
}

deleteProduct(ctih: string, ctid:string, sr:string, tkn:string): Observable<any> {
 // const headers = this.getHeaders(tkn);
  return this.http.delete('http://193.111.124.45:9815/wc-svc/webcust/DeleteRequestPic?ctih='+ctih+'&ctid='+ctid);
}

callSentRequest(custNo: string, requestno: string, macaddress:string): Observable<any>{
    return this.http.get("http://193.111.124.45:9815/wc-svc/webcust/sentrequest?Userid="+custNo+"&CtechId="+requestno+"&macaddress="+macaddress, {responseType: 'text' as 'text', withCredentials: true});  
  }

getImages(custNo: string, requestno: string, no: string, usr:string, tkn:string): Observable<string[]> {
  const url = `http://193.111.124.45:9815/wc-svc/images/${usr}/REQUEST/${requestno}?no=${no}`;
 // const headers = this.getHeaders(tkn);
  return this.http.get<string[]>(url , { withCredentials: true });
}

execpickproduct (data:DtoExePickProd){
  return this.http.post("http://193.111.124.45:9815/am-svc/webadmin/execpickprod?",data, {responseType: 'text' as 'text', withCredentials: true });  
}

execgetcontact (data:DtoExeGetContact){//p_custno:string, p_suppno:string, p_reqno:string, p_seqno:number){
  return this.http.post("http://193.111.124.45:9815/am-svc/webadmin/execgetcontact?",data, {responseType: 'text' as 'text', withCredentials: true });  
}

execgetSupplierQuotation (p_suppno:string){
  return this.http.get<quotationmanual[]>("http://193.111.124.45:9815/mc-svc/main/getBlastManualBySuppNoList?SuppNo="+ p_suppno,{withCredentials: true });  
}

getSupplierQuotationdetail (SuppNo:string, BlastId:string ){
  return this.http.get<quotationmanualdetail[]>("http://193.111.124.45:9815/mc-svc/main/getBlastManualDetailList?BlastId="+BlastId+"&SeqNo=1&SuppNo="+SuppNo, {withCredentials: true });  
}

getManualWebListbySupp (SuppNo:string){
  return this.http.get("http://193.111.124.45:9815/mc-svc/main/getManualWebListbySupp?SuppNo="+SuppNo,{withCredentials: true });
}

getsavemanualinquiryManual (data: DTOSaveManual){
  return this.http.post("http://193.111.124.45:9815/mc-svc/main/callProcSaveManual", data, {responseType: 'text' as 'text', withCredentials: true});
}

getsavemanualinquiryManualproduct (data: DTOSaveManualProduct){
  return this.http.post("http://193.111.124.45:9815/mc-svc/main/callProcSaveManualProduct", data, {responseType: 'text' as 'text', withCredentials: true});
}

getsavemanualinquiryproduct (data: DTOSavePickProduct){
  return this.http.post("http://193.111.124.45:9815/mc-svc/main/callProcSavePick?", data, {responseType: 'text' as 'text', withCredentials: true});
}

getsaveproductinquiryManual (data: DTOSaveManual){
  return this.http.post("http://193.111.124.45:9815/mc-svc/main/callProcSaveManual", data, {responseType: 'text' as 'text', withCredentials: true});
}

getsaveproductinquiryproduct (data: DTOSavePickProduct){
  return this.http.post("http://193.111.124.45:9815/mc-svc/main/callProcSavePick?", data, {responseType: 'text' as 'text', withCredentials: true});
}

private apiUrl = 'http://193.111.124.45:9815/mc-svc/main/getManualWebListbySupp';

getProductsBySupplier(suppNo: string): Observable<SellerCatalogProduct[]> {
    const url = `${this.apiUrl}?SuppNo=${suppNo}`;
    return this.http.get<SellerCatalogProduct[]>(url, {withCredentials: true });
  }

execgetSupplierQuotationproduct (p_suppno:string){
  return this.http.get<quotationproduct[]>("http://193.111.124.45:9815/mc-svc/main/getBlastProductBySuppNoList?SuppNo="+ p_suppno, {withCredentials: true });  
}

execgetSupplierQuotationproductdetail (p_blast:string, p_suppno:string){
  return this.http.get<DTOProductDetailBlast[]>("http://193.111.124.45:9815/mc-svc/main/getBlastProductDetailList?BlastId="+p_blast+"&SuppNo="+p_suppno, {withCredentials: true });  
}

//execgetproductwebdetail (p_suppno:string){
//  return this.http.get<QuotationByProductDetail[]>("http://193.111.124.45:9815/mc-svc/main/getproductweblistbySupp?SuppNo="+p_suppno );
//}

execgetproductwebdetail (p_suppno:string, ProdCode:string, ProdTypeCode:string){
 return this.http.get<SellerCatalogProduct[]>("http://193.111.124.45:9815/mc-svc/main/getProductWebListbySuppAndProdCodeAndProdTypeCode?SuppNo="+p_suppno+"&ProdCode="+ProdCode+"&ProdTypeCode="+ProdTypeCode , {withCredentials: true });
}

getImgBannerType(type: String): Observable<string[]> {
    const url = `http://193.111.124.45:9816/appmst-svc/images/banTypeImgbyType?type=` + type;
    return this.http.get<string[]>(url);
  }

}