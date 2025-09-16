import { sellerproductimage } from "./sellerproductimage";

export interface catalogproduct {
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
  dctwProductTypeSize: string | null;
  dctwProductTypeSpec: string;
  dctwProductTypeAlias: string;
  images: sellerproductimage[];
  dctwSupplierCode: string;
  dctwProvince: string | null;
  dctwCountry: string | null;
  dctwStatus: string;
}