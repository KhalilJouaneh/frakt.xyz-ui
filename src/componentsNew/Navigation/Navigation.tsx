import { useSelector } from 'react-redux';
import { compose, split, nth, tail } from 'ramda';
import { NavLink } from 'react-router-dom';
import cx from 'classnames';

import Icons from '../../iconsNew/';
import styles from './styles.module.scss';
import { NAVIGATION_LINKS, community, documentation } from './constants';
import { selectTheme } from '../../state/theme/selectors';

interface MenuItem {
  label: string;
  icon?: any;
  iconDark?: any;
  className?: string;
  event?: string;
  selector?: any;
  to?: string | ((param: string) => string);
  pathname?: string;
  props?: any;
  href?: string;
}

export const MenuItem = ({
  label,
  className,
  icon: rawIcon,
  iconDark,
  to,
  selector,
  pathname = '',
  href,
}: MenuItem) => {
  const theme: string = useSelector(selectTheme);
  const icon = theme === 'dark' ? iconDark : rawIcon;

  const isActive =
    compose(nth(1), split('/'))(location.pathname) === tail(pathname);

  if (typeof to === 'string') {
    return (
      <NavLink
        to={to}
        className={cx(styles.link, className, { [styles.active]: isActive })}
      >
        {icon && <span className={styles.icon}>{icon()}</span>}
        {label && <span className={styles.label}>{label}</span>}
      </NavLink>
    );
  } else if (typeof to === 'function') {
    const param: string = useSelector(selector);
    if (param) {
      return (
        <NavLink
          to={to(param)}
          className={cx(styles.link, className, { [styles.active]: isActive })}
        >
          {icon && <span className={styles.icon}>{icon()}</span>}
          {label && <span className={styles.label}>{label}</span>}
        </NavLink>
      );
    } else {
      return null;
    }
  }
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={href}
      className={cx(styles.link, className)}
    >
      {icon && <span className={styles.icon}>{icon()}</span>}
      {label && <span className={styles.label}>{label}</span>}
    </a>
  );
};

export const Navigation = ({
  onClose,
  close,
}: {
  onClose?: () => void;
  close?: boolean;
}) => {
  return (
    <div className={cx(styles.container, close && styles.closeContainer)}>
      <div className={styles.navigation}>
        <div
          className={cx(styles.burger, close && styles.burgerClose)}
          onClick={onClose}
        >
          {close ? <Icons.BurgerClosed /> : <Icons.BurgerOpen />}
        </div>

        {NAVIGATION_LINKS.map((item) => (
          <MenuItem
            label={!close && item.label}
            key={item.label}
            to={item.to}
            icon={(item as any).icon}
            iconDark={(item as any).iconDark}
            pathname={item.pathname}
            selector={item.selector}
          />
        ))}
      </div>
      <div className={styles.community}>
        {!close && <div className={styles.section}>Community</div>}
        {community.map((item) => (
          <MenuItem
            label={!close && item.label}
            icon={item.icon}
            iconDark={(item as any).iconDark}
            key={item.label}
            href={item?.href}
          />
        ))}
      </div>
      <div className={styles.documentation}>
        {!close && <div className={styles.section}>Documentation</div>}
        {documentation.map((item) => (
          <MenuItem
            label={!close && item.label}
            icon={item.icon}
            iconDark={(item as any).iconDark}
            key={item.label}
            href={item?.href}
          />
        ))}
      </div>
    </div>
  );
};
