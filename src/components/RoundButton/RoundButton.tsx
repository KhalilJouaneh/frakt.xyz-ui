import { FC } from 'react';
import styles from './RoundButton.module.scss';

interface RoundButtonProps {
  size: number;
  icon: JSX.Element;
  onClick?: any;
  className?: string;
}

const RoundButton: FC<RoundButtonProps> = ({
  size,
  icon,
  onClick,
  className,
}) => {
  return (
    <div onClick={onClick} className={className}>
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
