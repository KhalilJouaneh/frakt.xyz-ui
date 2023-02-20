import { QuestionCircleOutlined } from '@ant-design/icons';
import Tooltip from '@frakt/components/Tooltip';
import { FC } from 'react';

import styles from './SortableList.module.scss';

type Option = {
  key: string;
  title: string;
  tooltip?: string;
};

interface SortableListProps {
  options: Option[];
}

const SortableList: FC<SortableListProps> = ({ options }) => {
  return (
    <div className={styles.wrapper}>
      {options.map((option) => (
        <div key={option.key} className={styles.option}>
          <p className={styles.label}>{option.title}</p>
          {!!option?.tooltip && (
            <Tooltip placement="bottom" overlay={option?.tooltip}>
              <QuestionCircleOutlined className={styles.questionIcon} />
            </Tooltip>
          )}
        </div>
      ))}
    </div>
  );
};

export default SortableList;
