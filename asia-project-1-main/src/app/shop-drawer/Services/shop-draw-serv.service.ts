import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { DTOProcToCart } from '../../Home/Models/DTOProcToCart';

@Injectable({
  providedIn: 'root'
})
export class ShopDrawServService {
   private broadcastChannel: BroadcastChannel;
   vtkn:any; 
   private cartUpdatedSource = new Subject<void>();
  cartUpdated$ = this.cartUpdatedSource.asObservable();

   constructor(private http: HttpClient) {
     this.broadcastChannel = new BroadcastChannel('cart_update_channel');
     this.broadcastChannel.postMessage({ type: 'CART_UPDATED' });
    } 

    notifyCartUpdate() {
        console.log('Service: Mengirim sinyal cart update...');
    this.cartUpdatedSource.next();
     this.broadcastChannel.postMessage({ type: 'CART_UPDATED' });
    }

     private cartUpdateSource = new Subject<void>();

    getprodwebAll(): Observable<any>{    
        return this.http.get<Array<any>>("http://193.111.124.45:9815/wc-svc/webcust/getWebproductsAll", {withCredentials: true });
      }

    getproctocart(data: DTOProcToCart): Observable<any>{      
        return this.http.post("http://193.111.124.45:9815/mc-svc/main/callProcToCart",data,{ responseType: 'text',withCredentials: true });  
      }



     getcartList(custNo : string, status : string): Observable<any>{
        return this.http.get<Array<any>>("http://193.111.124.45:9815/mc-svc/cart/cartbyuser?custNo="+custNo+"&status="+status, {withCredentials: true });  
      }

      updateCart(userId: string,reqno: string, reqseq: string, cartid: string): Observable<string> {     
        const apiUrl = "http://193.111.124.45:9815/mc-svc/main/callProcessUpdCart";    
        const body = {
            userid: userId,
            reqno:reqno,
            reqseq:reqseq,
            cartid: cartid
        };
        const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' }), 
          responseType: 'text' as 'json' ,
          withCredentials: true  
        };
        return this.http.post<string>(apiUrl, body, httpOptions);
      }  
}