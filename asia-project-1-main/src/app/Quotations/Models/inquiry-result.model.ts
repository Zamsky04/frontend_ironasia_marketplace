export interface ProductImage {
  itemImageSrc: string;
  thumbnailImageSrc: string;
}

// Interface untuk setiap produk dalam penawaran
export interface ProductResponse {
  dctwReqNo: string;
  dctwReqSeq: number;
  dctwProductCode: number;
  dctwProductName: string;
  dctwProducttypeCode: number;
  dctwProducttypeName: string;
  dctwQty: number; // Kuantitas yang diminta pelanggan
  dctwReviseQty: number; // Kuantitas yang ditawarkan penjual
  dctwPrice: number; // Harga yang diminta pelanggan (jika ada)
  dctwRevisePrice: number; // Harga yang ditawarkan penjual
  dctwProducttypeDesc: string;
  dctwProductTypeSize: string;
  dctwProductTypeSpec: string;
  dctwProductTypeAlias: string | null;
  images: ProductImage[];
}

// Interface utama untuk setiap kartu penawaran dari penjual
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
  products: ProductResponse[];
  dctwBlastId: string;
  dctwResultBlastId: string;
  dctwQuoNo: string;
  dctwType: string;
  dctwTypeResponse: string;
  dctwFulfill: string;
}
