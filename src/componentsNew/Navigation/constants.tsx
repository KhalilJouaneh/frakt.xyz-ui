import { selectWalletPublicKey } from '../../state/common/selectors';
import { PATHS } from '../../constants';
import Icons from '../../iconsNew';

export const community = [
  {
    label: 'Discord',
    icon: Icons.Discord,
    iconDark: Icons.DiscordDark,
    href: 'https://discord.com/invite/UqbxgFrvCu',
  },
  {
    label: 'Twitter',
    icon: Icons.Twitter,
    iconDark: Icons.TwitterDark,
    href: 'https://twitter.com/FRAKT_HQ',
  },
];

export const documentation = [
  {
    label: 'Medium',
    icon: Icons.Medium,
    iconDark: Icons.MediumDark,
    href: 'https://medium.com/@frakt_HQ',
  },
  {
    label: 'GitHub',
    icon: Icons.Github,
    iconDark: Icons.GithubDark,
    href: 'https://github.com/frakt-solana',
  },
  {
    label: 'Docs',
    icon: Icons.Docs,
    iconDark: Icons.DocsDark,
    href: 'https://docs.frakt.xyz/frakt/',
  },
];

export const NAVIGATION_LINKS = [
  // {
  //   pathname: PATHS.PROFILE,
  //   to: (param) => `${PATHS.PROFILE}/${param}`,
  //   selector: selectWalletPublicKey,
  //   label: 'My profile',
  //   event: 'navigation-profile',
  //   icon: Icons.Lending,
  //   iconDark: Icons.LendingDark,
  // },
  {
    pathname: PATHS.BORROW,
    to: PATHS.BORROW,
    label: 'Borrow',
    event: 'navigation-borrow',
    icon: Icons.Borrow,
    iconDark: Icons.BorrowDark,
  },
  {
    pathname: PATHS.LOANS,
    to: PATHS.LOANS,
    label: 'My Loans',
    event: 'navigation-loans',
    icon: Icons.MyLoans,
    iconDark: Icons.MyLoansDark,
  },
  {
    pathname: PATHS.LEND,
    to: PATHS.LEND,
    label: 'Lending',
    event: 'navigation-lend',
    icon: Icons.Lending,
    iconDark: Icons.LendingDark,
  },
  {
    pathname: PATHS.LIQUIDATIONS,
    to: PATHS.LIQUIDATIONS,
    label: 'Liquidations',
    event: 'navigation-liquidation',
    icon: Icons.Raffles,
    iconDark: Icons.RafflesDark,
  },
  {
    pathname: PATHS.ROOT,
    to: PATHS.ROOT,
    label: 'Dashboard',
    icon: Icons.Dashboard,
    iconDark: Icons.DashboardDark,
  },
];
