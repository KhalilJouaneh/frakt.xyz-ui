import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Switch } from 'antd';
import { selectTheme } from '../../state/theme/selectors';
import { themeActions } from '../../state/theme/actions';
import styles from './styles.module.scss';

export const ThemeSwitcher = () => {
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
      checked={theme === 'dark'}
      className={styles.toggle}
      onChange={handleThemeChange}
    />
  );
};
