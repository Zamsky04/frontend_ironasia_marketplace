export interface ProductImage {
  itemImageSrc: string | null;
  thumbnailImageSrc: string | null;
}

// Merepresentasikan detail produk yang ditawarkan oleh seller
export interface OfferedProductDetail {
  dctwReqNo: string;
  dctwReqSeq: number;
  dctwProductCode: number;
  dctwProductName: string;
  dctwProducttypeCode: number;
  dctwProducttypeName: string;
  dctwQty: number;
  dctwReviseQty: number;
  dctwPrice: number;
  dctwRevisePrice: number;
  dctwProducttypeDesc: string;
  dctwProductTypeSize: string;
  dctwProductTypeSpec: string;
  dctwProductTypeAlias: string | null;
  images: ProductImage[];
}

// Merepresentasikan satu paket penawaran lengkap dari satu seller
// INI ADALAH SATU-SATUNYA MODEL DATA YANG KITA BUTUHKAN UNTUK HASIL API
export interface SellerResponse {
  dctwSuppNo: string;
  dctwSuppName: string;
  dctwSuppPhone: string;
  dctwSuppHandphone: string;
  dctwSuppAddress: string;
  dctwSuppKecamatan: string;
  dctwSuppCity: string;
  dctwSuppProvinsi: string;
  dctwSuppContactPeson: string;
  dctwCustNo: string;
  dctwCustName: string;
  products: OfferedProductDetail[];
  dctwBlastId: string;
  dctwResultBlastId: string;
  dctwQuoNo: string;
  dctwType: string;
  dctwTypeResponse: string;
  dctwFulfill: 'Y' | 'N';
}