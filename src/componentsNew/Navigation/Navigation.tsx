import Icons from '../../iconsNew/';
import { NavLink } from 'react-router-dom';
import cx from 'classnames';
import styles from './styles.module.scss';

import { NAVIGATION_LINKS } from '../../components/Header/AppNavigation/constants';

const community = [
  { label: 'Discord', icon: Icons.Discord },
  { label: 'Twitter', icon: Icons.Twitter },
];
const documentation = [
  { label: 'Medium', icon: Icons.Medium },
  { label: 'GitHub', icon: Icons.Github },
  { label: 'Docs', icon: Icons.Docs },
];

interface MenuItem {
  label: string;
  icon?: any;
  className?: string;
  event?: string;
  to?: string;
  props?: any;
}

const MenuItem = ({ label, className, icon = Icons.Chart, to }: MenuItem) => {
  if (to) {
    const isActive = location.pathname === to;
    return (
      <NavLink to={to} className={cx(className, { [styles.active]: isActive })}>
        {icon()}
        <span>{label}</span>
      </NavLink>
    );
  }
  return (
    <div className={className}>
      {icon()}
      <span>{label}</span>
    </div>
  );
};

export const Navigation = () => {
  return (
    <div className={styles.container}>
      <div className={styles.navigation}>
        {NAVIGATION_LINKS.map((item) => (
          <MenuItem
            label={item.label}
            key={item.label}
            className={item.label === 'Borrow' ? styles.active : ''}
            to={item.to}
          />
        ))}
      </div>
      <div className={styles.community}>
        <div className={styles.section}>Community</div>
        {community.map((item) => (
          <MenuItem label={item.label} icon={item.icon} key={item.label} />
        ))}
      </div>
      <div className={styles.documentation}>
        <div className={styles.section}>Documentation</div>
        {documentation.map((item) => (
          <MenuItem label={item.label} icon={item.icon} key={item.label} />
        ))}
      </div>
    </div>
  );
};
