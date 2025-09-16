import { sellerproductimage } from "./sellerproductimage";

export interface SellerCatalogProduct {
    dctwReqNo: string;
    dctwReqSeq: number;
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
    dctwBlastId: string;
    dctwSeq: string;
}