import { ImageDetail } from "./ImageDetail";

export interface QuotationByProductDetail {
  dctwCtechId: string;
  dctwId: number;
  dctwProductCode: number;
  dctwProductName: string;
  dctwProducttypeCode: number;
  dctwProducttypeName: string;
  dctwProducttypeStockQty: number;
  dctwProducttypeMinQty: number | null;
  dctwProducttypePrice: number;
  dctwProducttypeDesc: string;
  dctwProductTypeSize: string;
  dctwProductTypeSpec: string;
  dctwProductTypeAlias: string;
  images: ImageDetail[];
  dctwSupplierCode: string;
  dctwProvince: string;
  dctwCountry: string; // Ini sepertinya berisi nama Kota
  dctwStatus: string;
  dctwTotalProduct: number;
}