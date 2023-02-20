import { FC } from 'react';
import { ArrowUpOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import classNames from 'classnames';

import Tooltip from '@frakt/components/Tooltip';

import { Option, SORT_ORDER } from './hooks';
import styles from './SortableList.module.scss';

interface SortableListProps {
  options: Option[];
  setValue: any;
  orderState: string;
  onChangeSortOrder: any;
  fieldValue: any;
}

const SortableList: FC<SortableListProps> = ({
  options,
  setValue,
  orderState,
  onChangeSortOrder,
  fieldValue,
}) => {
  return (
    <div className={styles.wrapper}>
      {options.map(({ value, label, tooltip }) => (
        <div
          key={value}
          className={styles.option}
          onClick={() => {
            onChangeSortOrder();
            setValue('sort', { value, label });
          }}
        >
          <p className={styles.label}>{label}</p>
          {!!tooltip && (
            <Tooltip placement="bottom" overlay={tooltip}>
              <QuestionCircleOutlined className={styles.questionIcon} />
            </Tooltip>
          )}
          <ArrowUpOutlined
            className={classNames({
              [styles.arrowDown]:
                orderState === SORT_ORDER.DESC && fieldValue === value,
            })}
          />
        </div>
      ))}
    </div>
  );
};

export default SortableList;
