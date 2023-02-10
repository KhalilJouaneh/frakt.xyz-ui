export interface MarketOrder {
  ltv: number;
  size: number;
  interest: number;
  synthetic?: boolean;
  rawData: {
    publicKey: string;
    assetReceiver: string;
    authorityAdapter: string;
    edgeSettlement: number;
  };
}
