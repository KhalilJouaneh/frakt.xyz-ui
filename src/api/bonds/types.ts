enum MarketState {
  Initializing = 'initializing',
  Available = 'available',
}

enum MarketTrustType {
  Unverified = 'unverified',
  Verified = 'verified',
}

enum MarketPairTokenType {
  NativeSol = 'nativeSol',
  Spl = 'spl',
}

enum MarketPairValidationType {
  ClassicValidation = 'classicValidation',
  CustomValidation = 'customValidation',
}

interface FMarket {
  publicKey: string;
  authority: string;
  createdAt: string;
  isRemoved: false;
  state: 'initialized'; //TODO what's this?
  updatedAt: string;
  whitelistQuantity: number;
  hadoMarket: string;
}

export interface Market {
  publicKey: string;
  createdAt: string;
  isRemoved: boolean;
  marketAuthority: string;
  marketDecimals: number;
  marketState: MarketState;
  marketTrustType: MarketTrustType;
  minBidCap: number;
  pairTokenMint: string;
  pairTokenType: MarketPairTokenType;
  pairValidationType: MarketPairValidationType;
  updatedAt: string;
  validationAdapterProgram: string;
  image: string;
  name: string;
  fraktMarket: FMarket;
}

export interface MarketPreview {
  marketPubkey: string;
  collectionName: string;
  collectionImage: string;
  offerTVL: string;
}
