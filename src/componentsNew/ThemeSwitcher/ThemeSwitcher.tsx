import { useEffect, FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Switch from 'react-switch';

import { selectTheme } from '../../state/theme/selectors';
import { themeActions } from '../../state/theme/actions';
import styles from './styles.module.scss';
import Icons from '../../iconsNew';

export const ThemeSwitcher: FC = () => {
  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeChange = (evt) => {
    const next = theme === 'dark' ? 'light' : 'dark';
    dispatch(themeActions.setTheme(next));
  };

  return (
    <Switch
      width={64}
      className={styles.switch}
      onChange={handleThemeChange}
      checked={theme === 'dark'}
      offColor={'#fff'}
      offHandleColor={'#fff'}
      uncheckedHandleIcon={<Icons.Sun />}
      checkedHandleIcon={<Icons.Moon />}
    />
  );
};
