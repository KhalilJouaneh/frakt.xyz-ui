import {
  BondingCurveType,
  PairAuthorityType,
  MarketState,
  MarketTrustType,
  PairTokenType,
  PairValidationType,
  PairState,
  PairType,
  WhitelistType,
} from 'fbonds-core/lib/cross-mint-amm/types';

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

interface MarketWhitelistEntry {
  _id: string;
  publicKey: string;
  createdAt: string;
  fraktMarket: string;
  isDeployed: boolean;
  isRemoved: boolean;
  updatedAt: string;
  whitelistType: WhitelistType;
  whitelistedAddress: string;
}

interface MarketOracle {
  publicKey: string;
  fraktMarket: string;
  oracleAuthority: string;
  oracleInfo: string;
  floor: number;
  lastUpdatedAt: number;
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
  pairTokenType: PairTokenType;
  pairValidationType: PairValidationType;
  updatedAt: string;
  validationAdapterProgram: string;
  image: string;
  name: string;
  fraktMarket: FMarket;
  whitelistEntries: Array<MarketWhitelistEntry>;
  oracleFloor: Array<MarketOracle>;
}

export interface MarketPreview {
  marketPubkey: string;
  collectionName: string;
  collectionImage: string;
  offerTVL: string;
}

export interface Pair {
  publicKey: string;
  assetReceiver: string;
  baseSpotPrice: number;
  bidCap: number;
  bidSettlement: number;
  bondingCurve: {
    delta: number;
    bondingType: BondingCurveType;
  };
  buyOrdersQuantity: number;
  concentrationIndex: number;
  createdAt: string;
  currentSpotPrice: number;
  edgeSettlement: number;
  fee: number;
  feeTokenAccount: string;
  feeVaultSeed: number;
  fundsSolOrTokenBalance: number;
  fundsSolVaultSeed: number;
  fundsTokenAccount: string;
  hadoMarket: string;
  initialFundsSolOrTokenBalance: number;
  isRemoved: boolean;
  lastTransactedAt: number;
  lpTokensInCirculation: number;
  lpTokensMint: string;
  mathCounter: number;
  nftsSeed: number;
  authorityAdapterPublicKey: string;
  pairAuthorityAdapterProgram: string;
  pairAuthorityType: PairAuthorityType;
  pairState: PairState;
  pairType: PairType;
  sellOrdersCount: number;
  solOrTokenFeeAmount: number;
  updatedAt: string;
  validation: {
    publicKey: string;
    createdAt: string;
    durationFilter: number;
    isRemoved: boolean;
    loanToValueFilter: number;
    pair: string;
    updatedAt: string;
    user: string;
  };
}
