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

export interface Market {
  marketPubkey: string;
  collectionName: string;
  collectionImage: string;
  isRemoved: boolean;
  marketAuthority: string;
  marketDecimals: number;
  marketState: MarketState;
  marketTrustType: MarketTrustType;
  minBidCap: number;
  pairTokenMint: string;
  pairTokenType: MarketPairTokenType;
  pairValidationType: MarketPairValidationType;
  validationAdapterProgram: string;
  createdAt: string;
  updatedAt: string;
}
