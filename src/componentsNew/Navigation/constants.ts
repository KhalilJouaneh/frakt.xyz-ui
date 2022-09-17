import { PATHS } from '../../constants';
import { selectWalletPublicKey } from '../../state/common/selectors';
import Icons from '../../iconsNew/';

export const community = [
  { label: 'Discord', icon: Icons.Discord },
  { label: 'Twitter', icon: Icons.Twitter },
];

export const documentation = [
  { label: 'Medium', icon: Icons.Medium },
  { label: 'GitHub', icon: Icons.Github },
  { label: 'Docs', icon: Icons.Docs },
];

export const NAVIGATION_LINKS = [
  {
    pathname: PATHS.PROFILE,
    to: (param) => `${PATHS.PROFILE}/${param}`,
    selector: selectWalletPublicKey,
    label: 'My profile',
    event: 'navigation-profile',
    icon: Icons.Lending,
  },
  {
    pathname: PATHS.BORROW,
    to: PATHS.BORROW,
    label: 'Borrow',
    event: 'navigation-borrow',
    icon: Icons.Borrow,
  },
  {
    pathname: PATHS.LOANS,
    to: PATHS.LOANS,
    label: 'My Loans',
    event: 'navigation-loans',
    icon: Icons.MyLoans,
  },
  {
    pathname: PATHS.LEND,
    to: PATHS.LEND,
    label: 'Lending',
    event: 'navigation-lend',
    icon: Icons.Lending,
  },
  {
    pathname: PATHS.LIQUIDATIONS,
    to: PATHS.LIQUIDATIONS,
    label: 'Liquidations',
    event: 'navigation-liquidation',
    icon: Icons.Raffles,
  },
  {
    pathname: PATHS.ROOT,
    to: PATHS.ROOT,
    label: 'Dashboard',
    icon: Icons.Dashboard,
  },
];
