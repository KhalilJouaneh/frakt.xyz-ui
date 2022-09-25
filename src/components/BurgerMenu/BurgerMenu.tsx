import { useState } from 'react';

import ThemeSwitcher from '../../componentsNew/ThemeSwitcher';
import styles from './BurgerMenu.module.scss';
import {
  community,
  documentation,
  NAVIGATION_LINKS,
} from '../../componentsNew/Navigation';
import { MenuItem } from '../../componentsNew/Navigation/Navigation';
import { useSelector } from 'react-redux';
import { selectTheme } from '../../state/theme/selectors';

interface BurgerMenuProps {
  className?: string;
}

const BurgerMenu = ({ className = '' }: BurgerMenuProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const closeMenu = (): void => setIsOpen(false);
  const theme: string = useSelector(selectTheme);

  const isDark = theme === 'dark';

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
          {NAVIGATION_LINKS.map(({ label, to, pathname }) => (
            <MenuItem
              key={label}
              label={label}
              to={to}
              pathname={pathname}
              className={styles.link}
            />
          ))}
        </ul>
        <div className={styles.community}>
          <p className={styles.subtitle}>Community</p>
          <div className={styles.icons}>
            {community.map(({ icon, iconDark, href }, idx) => (
              <a
                key={idx}
                target="_blank"
                rel="noopener noreferrer"
                href={href}
              >
                {isDark ? iconDark(null) : icon(null)}
              </a>
            ))}
          </div>
        </div>
        <div className={styles.documentation}>
          <p className={styles.subtitle}>Documentation</p>
          <div className={styles.icons}>
            {documentation.map(({ icon, iconDark, href }, idx) => (
              <a
                key={idx}
                target="_blank"
                rel="noopener noreferrer"
                href={href}
              >
                {isDark ? iconDark(null) : icon(null)}
              </a>
            ))}
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
