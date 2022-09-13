import { PATHS } from '../../../constants';
import {
  TwitterIcon,
  DiscordIcon,
  GitHubIcon,
  MediumIcon,
  DocsIcon,
} from '../../../icons';
import { selectWalletPublicKey } from '../../../state/common/selectors';

export const NAVIGATION_LINKS = [
  {
    pathname: PATHS.PROFILE,
    to: (param) => `${PATHS.PROFILE}/${param}`,
    selector: selectWalletPublicKey,
    label: 'My profile',
    event: 'navigation-profile',
  },
  {
    pathname: PATHS.BORROW,
    to: PATHS.BORROW,
    label: 'Borrow',
    event: 'navigation-borrow',
  },
  {
    pathname: PATHS.LOANS,
    to: PATHS.LOANS,
    label: 'My Loans',
    event: 'navigation-loans',
  },
  {
    pathname: PATHS.LEND,
    to: PATHS.LEND,
    label: 'Lending',
    event: 'navigation-lend',
  },
  {
    pathname: PATHS.LIQUIDATIONS,
    to: PATHS.LIQUIDATIONS,
    label: 'Liquidations',
    event: 'navigation-liquidation',
  },
  {
    pathname: PATHS.ROOT,
    to: PATHS.ROOT,
    label: 'Dashboard',
  },
];

export const DROPDOWN_EXTERNAL_LINKS = [
  {
    label: 'Twitter',
    href: 'https://twitter.com/FRAKT_HQ',
    icon: TwitterIcon,
  },
  {
    label: 'Discord',
    href: 'https://tinyurl.com/zp3rx6z3',
    icon: DiscordIcon,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/frakt-solana',
    icon: GitHubIcon,
  },
  {
    label: 'Medium',
    href: 'https://medium.com/@frakt_HQ',
    icon: MediumIcon,
  },
  {
    label: 'Docs',
    href: 'https://docs.frakt.xyz/',
    icon: DocsIcon,
  },
];
