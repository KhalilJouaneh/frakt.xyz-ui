import { FC } from 'react';

import styles from './ChangeSidesButton.module.scss';

interface ChangeSidesButtonProps {
  onClick: () => void;
}

const ChangeSidesButton: FC<ChangeSidesButtonProps> = ({ onClick }) => {
  return (
    <button onClick={onClick} className={styles.changeSidesBtn}>
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path
          d="M7 4V20M7 20L3 16M7 20L11 16M17 4V20M17 4L21 8M17 4L13 8"
          stroke="var(--secondary-border)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default ChangeSidesButton;
