import { Arrow } from '@frakt/iconsNew/Arrow';
import classNames from 'classnames';
import { FC } from 'react';

import styles from './GoBackButton.module.scss';

interface GoBackButtonProps {
  onClick?: () => void;
  className?: string;
}

export const GoBackButton: FC<GoBackButtonProps> = ({ className, onClick }) => {
  return (
    <div onClick={onClick} className={classNames(styles.root, className)}>
      <Arrow />
    </div>
  );
};
