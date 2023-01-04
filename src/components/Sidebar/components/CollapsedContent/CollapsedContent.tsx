import { FC } from 'react';
import cx from 'classnames';

import styles from './CollapsedContent.module.scss';
import Button from '@frakt/components/Button';

interface CollapsedContentProps {
  isVisible: boolean;
  onClick: () => void;
  title: string;
}

const CollapsedContent: FC<CollapsedContentProps> = ({
  isVisible,
  onClick,
  title,
}) => {
  return (
    <div
      className={cx(styles.collapsedContent, {
        [styles.collapsedContentVisible]: isVisible,
      })}
    >
      <Button
        onClick={onClick}
        type="secondary"
        className={styles.collapsedBtn}
      >
        {title}
      </Button>
    </div>
  );
};

export default CollapsedContent;
