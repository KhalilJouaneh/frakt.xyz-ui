import { PATHS } from '../../constants';
import {
  Discord,
  DiscordDark,
  Twitter,
  TwitterDark,
  Medium,
  MediumDark,
  Github,
  GithubDark,
  Docs,
  DocsDark,
  Dashboard,
  DashboardDark,
  Borrow,
  BorrowDark,
  Lending,
  LendingDark,
  Raffles,
  RafflesDark,
  MyLoans,
  MyLoansDark,
  // Bonds,
  // BondsDark,
} from '@frakt/icons';

export const community = [
  {
    label: 'Discord',
    icon: Discord,
    iconDark: DiscordDark,
    href: process.env.FRAKT_DISCORD_SERVER,
  },
  {
    label: 'Twitter',
    icon: Twitter,
    iconDark: TwitterDark,
    href: 'https://twitter.com/FRAKT_HQ',
  },
];

export const documentation = [
  {
    label: 'Medium',
    icon: Medium,
    iconDark: MediumDark,
    href: 'https://medium.com/@frakt_HQ',
  },
  {
    label: 'GitHub',
    icon: Github,
    iconDark: GithubDark,
    href: 'https://github.com/frakt-solana',
  },
  {
    label: 'Docs',
    icon: Docs,
    iconDark: DocsDark,
    href: 'https://docs.frakt.xyz/frakt/',
  },
];

export const NAVIGATION_LINKS = [
  {
    pathname: PATHS.ROOT,
    to: PATHS.ROOT,
    label: 'Dashboard',
    icon: Dashboard,
    iconDark: DashboardDark,
    fillIcon: true,
  },
  {
    pathname: PATHS.BORROW,
    to: PATHS.BORROW,
    label: 'Borrow',
    event: 'navigation-borrow',
    icon: Borrow,
    iconDark: BorrowDark,
  },

  {
    pathname: PATHS.LEND,
    to: PATHS.LEND,
    label: 'Lending',
    event: 'navigation-lend',
    icon: Lending,
    iconDark: LendingDark,
  },
  {
    pathname: PATHS.LIQUIDATIONS,
    to: PATHS.LIQUIDATIONS,
    label: 'Raffles',
    event: 'navigation-liquidation',
    icon: Raffles,
    iconDark: RafflesDark,
    fillIcon: true,
  },
  {
    pathname: PATHS.LOANS,
    to: PATHS.LOANS,
    label: 'My loans',
    event: 'navigation-loans',
    icon: MyLoans,
    iconDark: MyLoansDark,
  },
  // {
  //   pathname: PATHS.BONDS,
  //   to: PATHS.BONDS,
  //   label: 'My bonds',
  //   event: 'navigation-bonds',
  //   icon: Bonds,
  //   iconDark: BondsDark,
  // },
];
