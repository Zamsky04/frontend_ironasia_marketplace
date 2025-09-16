import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { productlist } from '../Models/productlist';
import { producttypelist } from '../Models/producttypelist';


@Injectable({
  providedIn: 'root'
})
export class ServProductTypeService {

  dataprod = [
    { 
      prodno: '1',
      title: 'Product 1', 
      image: 'assets/product1.jpg', 
      price: '$10',
      description: 'This is product 1'
    },
    { 
      prodno: '2',
      title: 'Product 2', 
      image: 'assets/product2.jpg', 
      price: '$20',
      description: 'This is product 2' 
    },
    // ... more products
  ];
  
  showDropdown: boolean[] = this.dataprod.map(() => false); 
  
    constructor(private http:HttpClient) { }
  
   getProductList(): Observable<any>{
      return this.http.get<Array<productlist>>("http://193.111.124.45:9815/appmst-svc/product/getCmprListAll", {withCredentials: true });  
    }
  
    getImageProducts(): Observable<string[]> {
      const url = `http://193.111.124.45:9815/appmst-svc/images/productImg`;
      return this.http.get<string[]>(url, {withCredentials: true });
    }
  
    getProductLypeImage(prodcode:string): Observable<any>{
      const url = `http://193.111.124.45:9815/appmst-svc/images/producttype/${prodcode}`;
      return this.http.get<Array<producttypelist>>(url, {withCredentials: true });
    }
  
    getProductTypeList(code:String): Observable<any>{
      return this.http.get<Array<producttypelist>>("http://193.111.124.45:9815/appmst-svc/prodtype/getCmprtListByCmprCode?CmprCode="+code, {withCredentials: true });  
    }
  
    getProductByCode(code:String): Observable<any>{
      return this.http.get<Array<productlist>>("http://193.111.124.45:9815/appmst-svc/appmst/getCmprSingle?code="+code, {withCredentials: true });  
    }
  
    getProductTypeByCode(code:String): Observable<any>{
      return this.http.get<Array<producttypelist>>("http://193.111.124.45:9815/appmst-svc/prodtype/getCmprtListByCmprCode?CmprCode="+code, {withCredentials: true });  
    }
  
    getImages(custNo: string, requestno: string, no: string): Observable<string[]> {
    const url = `http://193.111.124.45:9815/wc-svc/images/${custNo}/REQUEST/${requestno}?no=${no}`;
    return this.http.get<string[]>(url, {withCredentials: true });
  }
  }
  
