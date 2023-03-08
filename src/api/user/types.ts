export interface UserInfoRaw {
  avatar: string;
  discordId: string;
  isOnServer: boolean;
}

export interface UserInfo {
  avatarUrl: string;
  isOnServer: boolean;
}

export enum NotificationType {
  LOAN = 'loan',
  DEPOSIT = 'deposit',
  LOT_TICKET = 'lotTicket',
  GRACE = 'grace',
}

export interface Notification {
  id: string;
  type: NotificationType;
  user: string;
  message: {
    title: string;
    body: string;
  };
  image?: string;
  isRead: boolean;
  date: number;
}

export enum NotificationEvents {
  LOANS = 'loans',
  DEPOSITS = 'deposits',
  LOT_TICKETS = 'lotTickets',
  GRACES = 'graces',
  LIQUIDATIONS_IN_24H = 'liquidationsIn24h',
}

export interface NotificationsSettings {
  [NotificationEvents.LOANS]: boolean;
  [NotificationEvents.DEPOSITS]: boolean;
  [NotificationEvents.LOT_TICKETS]: boolean;
  [NotificationEvents.GRACES]: boolean;
  [NotificationEvents.LIQUIDATIONS_IN_24H]: boolean;
}

export interface UserStats {
  bonds: BondsUserStats;
  totalStats: TotalStats;
  dailyActivity: DailyActivity;
  lastLoans: LastLoans[];
  lendingPools: LedningPools[];
}

export interface BondsUserStats {
  activeUserLoans: number;
  bondUserAmount: number;
  userOffers: number;
  userOffersAmount: number;
}

export interface TotalStats {
  lockedNftsInPools: number;
  poolsTvl: number;
  poolsVolumeAllTime: number;
  totalIssued: number;
  loansTvl: number;
  loansVolumeAllTime: number;
  activeLoansCount: number;
}

export interface DailyActivity {
  lockedNftsInLoans: number;
  issuedIn24Hours: number;
  paidBackIn24Hours: number;
  liquidatedIn24Hours: number;
  dailyVolume: number;
}

export interface LastLoans {
  image: string;
  loanValue: number;
  nftName: string;
}

export interface LedningPools {
  collectionsCount?: number;
  apr: number;
  image: string;
  nftName: string;
  tvl: number;
}
