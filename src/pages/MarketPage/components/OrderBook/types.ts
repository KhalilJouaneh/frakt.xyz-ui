export interface MarketOrder {
  ltv: number;
  size: number;
  apr: number;
  synthetic?: boolean;
  rawData: {
    publicKey: string;
    assetReceiver: string;
    authorityAdapter: string;
    edgeSettlement: number;
  };
}
