import { FC } from 'react';
import styles from './RoundButton.module.scss';

interface RoundButtonProps {
  size: number;
  icon: JSX.Element;
  onClick?: any;
}

const RoundButton: FC<RoundButtonProps> = ({ size, icon, onClick }) => {
  return (
    <div onClick={onClick}>
      <div
        style={{ width: `${size}px`, height: `${size}px` }}
        className={styles.roundButton}
      >
        {icon}
      </div>
    </div>
  );
};

export default RoundButton;
