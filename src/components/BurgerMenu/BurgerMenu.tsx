import { useNotificationsSider } from '@frakt/components/NotificationsSider';

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
import { useBurgerMenu } from './hooks';

interface BurgerMenuProps {
  className?: string;
}

const BurgerMenu = ({ className = '' }: BurgerMenuProps): JSX.Element => {
  const { isVisible, toggleVisibility } = useBurgerMenu();
  const { setVisibility: setNotificationsSiderVisibility } =
    useNotificationsSider();

  const theme: string = useSelector(selectTheme);

  const isDark = theme === 'dark';

  const onBurgerIconClick = () => {
    if (!isVisible) {
      setNotificationsSiderVisibility(false);
    }
    toggleVisibility();
  };

  return (
    <>
      <div
        className={`${styles.burgerIcon} ${
          isVisible ? styles.opened : ''
        } ${className}`}
        onClick={onBurgerIconClick}
      >
        <div className={styles.centerIconLine} />
      </div>
      <div
        className={`${styles.wrapper} ${
          !isVisible ? styles.menuOverlayHidden : ''
        }`}
        onClick={toggleVisibility}
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
