import { Routes } from '@angular/router';
import { MainHomeComponent } from './Home/main-home/main-home.component';
import { ReqListComponent } from './Seller/Request/Components/req-list/req-list.component';
import { LoginCompComponent } from './login/Components/login-comp/login-comp.component';
import { CompRegisComponent } from './Registration/Components/comp-regis/comp-regis.component';
import { QuoListComponent } from './Quotations/Components/quo-list/quo-list.component';
import { QuoManualListComponent } from './Quotations/Components/quo-byproduct-list/quo-manual-list.component';
import { FindComponent } from './pages/find/find.component';
import { CartComponent } from './pages/cart/cart.component';
import { HotDealsComponent } from './Home/hot-deals/hot-deals.component';
import { NewArrivalsComponent } from './Home/new-arrivals/new-arrivals.component';
import { TopRankingComponent } from './Home/top-ranking/top-ranking.component';
import { ResultQuatationByProductsComponent } from './Quotations/Components/result-quatation-by-products/result-quatation-by-products.component';
import { ResultQuatationManualComponent } from './Quotations/Components/result-quatation-manual/result-quatation-manual.component';
import { SellerQuotationByProductComponent } from './Seller/Components/seller-quotation-by-product/seller-quotation-by-product.component';
import { SellerQuotationManualComponent } from './Seller/Components/seller-quotation-manual/seller-quotation-manual.component';
import { SellerQuotationManualDetailComponent } from './Seller/Components/seller-quotation-manual-detail/seller-quotation-manual-detail.component';
import { SellerQuotationByProductDetailComponent } from './Seller/Components/seller-quotation-by-product-detail/seller-quotation-by-product-detail.component';
import { ViewInquiryResultsComponent } from './Quotations/ResultInquiries/view-inquiry-results/view-inquiry-results.component';
import { InquiryProductListComponent } from './Quotations/ResultInquiries/inquiry-product-list/inquiry-product-list.component';
import { InquiryManualListComponent } from './Quotations/resultInquirymanual/inquiry-manual-list/inquiry-manual-list.component';
import { SearchBarComponent } from './pages/Search/search-bar/search-bar.component';
import { authGuard } from './auth.guard';
import { ForgotPasswordComponent } from './Home/forgot-password/forgot-password.component';
import { TabCustProfileComponent } from './CustomerAccount/TabMenu/Forms/tab-cust-profile/tab-cust-profile.component';
import { ResetPasswordComponent } from './Home/reset-password/reset-password.component';

export const routes: Routes = [
    { path: 'mainhome', component: MainHomeComponent  },
    { path: 'regis', component: CompRegisComponent  },
    { path: 'requestlist', component: ReqListComponent },
    { path: 'quotationlist', component: QuoListComponent },
    { path: 'quotationManuallist', component: QuoManualListComponent },
    { path: 'sellerquotationlist', component: SellerQuotationByProductComponent },
    { path: 'seller-quotation-manual/detail/:blastId', component: SellerQuotationManualDetailComponent     },
    { path: 'seller-quotation-product/detail/:blastId/:seqNo', component: SellerQuotationByProductDetailComponent    },
    { path: 'sellerquotationManuallist', component: SellerQuotationManualComponent },
    { path: 'resultquotationlist', component: ResultQuatationByProductsComponent },
    { path: 'resultquotationManuallist', component: ResultQuatationManualComponent },
    { path: 'inquiry-results-list', component: InquiryProductListComponent },
    { path: 'inquiry-results-manual-list', component: InquiryManualListComponent },
    { path: 'login', component: LoginCompComponent },
    { path: 'regis', component: CompRegisComponent },
    { path: 'find', component: FindComponent },
     { path: 'search', component: SearchBarComponent },
    { path: 'cart', component: CartComponent },
    { path: 'hotdeal', component: HotDealsComponent },
    { path: 'newarrival', component: NewArrivalsComponent },
    { path: 'topranking', component: TopRankingComponent },
    { path: 'forgotpass', component: ForgotPasswordComponent },
     { path: 'reset/:token', component: ResetPasswordComponent },
    { path: 'CustomerProfile', component: TabCustProfileComponent },
    { path: '', redirectTo: 'mainhome', pathMatch: 'full', resolve: {
        log: () => console.log('Redirect dipicu ke /mainhome')
      }  }, // Redirect ke requestlist
   
];