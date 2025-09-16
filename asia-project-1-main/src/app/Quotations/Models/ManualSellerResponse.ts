export interface ManualSellerResponse {
  dctwSuppNo: string;
  dctwSuppName: string;
  dctwSuppPhone: string | null;
  dctwSuppHandphone: string;
  dctwSuppAddress: string;
  dctwSuppKecamatan: string;
  dctwSuppCity: string;
  dctwSuppProvinsi: string;
  dctwSuppContactPeson: string;
  dctwCustNo: string;
  dctwCustName: string;
  dctwNotes: string; // Catatan dari penjual
  dctwQty: number; // Kuantitas penawaran
  dctwPrice: number; // Harga penawaran
  dctwBlastId: string;
  dctwResultBlastId: string;
  dctwResultSeq: number;
  dctwQuoNo: string;
  dctwQuoSeq: number;
  dctwType: string;
  dctwTypeResponse: string;
}