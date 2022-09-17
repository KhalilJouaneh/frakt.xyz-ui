import { useState } from 'react';

import ThemeSwitcher from '../../componentsNew/ThemeSwitcher';
import styles from './BurgerMenu.module.scss';
import {
  community,
  documentation,
  NAVIGATION_LINKS,
} from '../../componentsNew/Navigation';
import { MenuItem } from '../../componentsNew/Navigation/Navigation';

interface BurgerMenuProps {
  className?: string;
}

const BurgerMenu = ({ className = '' }: BurgerMenuProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const closeMenu = (): void => setIsOpen(false);

  return (
    <>
      <div
        className={`${styles.burgerIcon} ${
          isOpen ? styles.opened : ''
        } ${className}`}
        onClick={(): void => setIsOpen(!isOpen)}
      >
        <div className={styles.centerIconLine} />
      </div>
      <div
        className={`${styles.wrapper} ${
          !isOpen ? styles.menuOverlayHidden : ''
        }`}
        onClick={closeMenu}
      >
        <ul className={styles.navigation}>
          {NAVIGATION_LINKS.map(({ label, to, pathname, selector }) => (
            <MenuItem
              key={label}
              label={label}
              to={to}
              pathname={pathname}
              selector={selector}
              className={styles.link}
            />
          ))}
        </ul>
        <div className={styles.community}>
          <p className={styles.subtitle}>Community</p>
          <div className={styles.icons}>
            {community.map(({ icon }) => icon())}
          </div>
        </div>
        <div className={styles.documentation}>
          <p className={styles.subtitle}>Documentation</p>
          <div className={styles.icons}>
            {documentation.map(({ icon }) => icon())}
          </div>
        </div>
        <div className={styles.switcher}>
          <ThemeSwitcher />
        </div>
      </div>
    </>
  );
};

export default BurgerMenu;
