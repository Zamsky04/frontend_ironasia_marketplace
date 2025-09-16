import { ImageDetail } from "./ImageDetail";

export interface DTOProductDetailBlast {
  dctwQuoNo: string;
  dctwSeq: number;
  dctwProductCode: number;
  dctwProductName: string;
  dctwProducttypeCode: number;
  dctwProducttypeName: string;
  dctwProducttypeStockQty: number;
  dctwProducttypeMinQty: number;
  dctwProducttypePrice: number; // BigDecimal is mapped to number
  dctwProducttypeDesc: string;
  dctwProductTypeSize: string;
  dctwProductTypeSpec: string;
  dctwProductTypeAlias: string;
  images: ImageDetail[]; // List is mapped to an array
  dctwCustNo: string;
  dctwProvince: string;
  dctwCountry: string;
  dctwStatus: string;
  dctwTotalProduct: number;
  dctwBlastId: string;
  dctwSuppNo: string;
}