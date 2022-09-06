import { useSelector } from 'react-redux';
import { compose, split, nth, tail } from 'ramda';
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
  selector?: any;
  to?: string | ((param: string) => string);
  pathname?: string;
  props?: any;
}

const MenuItem = ({
  label,
  className,
  icon = Icons.Chart,
  to,
  selector,
  pathname = '',
}: MenuItem) => {
  const isActive =
    compose(nth(1), split('/'))(location.pathname) === tail(pathname);

  if (typeof to === 'string') {
    return (
      <NavLink to={to} className={cx(className, { [styles.active]: isActive })}>
        {icon()}
        <span>{label}</span>
      </NavLink>
    );
  } else if (typeof to === 'function') {
    const param: string = useSelector(selector);
    if (param) {
      return (
        <NavLink
          to={to(param)}
          className={cx(className, { [styles.active]: isActive })}
        >
          {icon()}
          <span>{label}</span>
        </NavLink>
      );
    } else {
      return null;
    }
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
            to={item.to}
            pathname={item.pathname}
            selector={item.selector}
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
