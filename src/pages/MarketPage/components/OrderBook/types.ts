export interface MarketOrder {
  ltv: number;
  size: number;
  interest: number;
  rawData: {
    publicKey: string;
    assetReceiver: string;
    authorityAdapter: string;
    edgeSettlement: number;
  };
}
