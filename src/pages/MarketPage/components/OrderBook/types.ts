export interface MarketOrder {
  publicKey: string;
  ltv: number;
  size: number;
  interest: number;
  assetReceiver: string;
}
