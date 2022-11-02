import { FC } from 'react';

import styles from './BondMode.module.scss';
import Toggle from '../../Toggle';

interface BondModeProps {
  onChange: (value: boolean) => void;
  value: boolean;
}

const BondMode: FC<BondModeProps> = ({ onChange, value }) => {
  return (
    <div className={styles.wrapper}>
      <Toggle label="Buy bonds" onChange={onChange} value={value} />
      <p className={styles.title}>
        {`I'm okay with recieveing defaulted NFTs of these collections
      (selector dropdown) instead of deposit in exchange for higher
      yields. (180% APY)`}
      </p>
      <p className={styles.subtitle}>Read more</p>
    </div>
  );
};

export default BondMode;
