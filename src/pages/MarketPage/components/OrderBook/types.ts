export interface MarketOrder {
  ltv: number;
  size: number;
  interest: number;
  synthetic?: boolean;
  duration: number;
  rawData: {
    publicKey: string;
    assetReceiver: string;
    authorityAdapter: string;
    edgeSettlement: number;
  };
}
