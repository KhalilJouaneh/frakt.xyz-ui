import { FC } from 'react';

import { LinkWithArrow } from '../../../../components/LinkWithArrow';
import styles from './NoSuitableNft.module.scss';

const ACCEPTED_FOR_LOANS_COLLECTIONS_LINK =
  'https://docs.frakt.xyz/frakt/loans/collections-accepted-for-loans';

interface NoSuitableNftProps {
  className?: string;
}

const NoSuitableNft: FC<NoSuitableNftProps> = () => {
  return (
    <div className={styles.noSuitableMessageWrapper}>
      <p className={styles.noSuitableMessage}>No suitable NFTs found</p>
      <LinkWithArrow
        className={styles.acceptedCollectionsLink}
        label="Check collections accepted for loans"
        to={ACCEPTED_FOR_LOANS_COLLECTIONS_LINK}
        externalLink
      />
    </div>
  );
};

export default NoSuitableNft;
