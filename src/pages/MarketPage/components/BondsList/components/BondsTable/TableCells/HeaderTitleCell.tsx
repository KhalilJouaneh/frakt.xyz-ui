import { FC } from 'react';

import { QuestionCircleOutlined } from '@ant-design/icons';
import Tooltip from '@frakt/components/Tooltip';
import {
  ArrowDownTableSort,
  ArrowTableSort,
  ArrowUpTableSort,
} from '@frakt/icons';

import styles from './TableCells.module.scss';
import { SortColumns } from '../columns';
import classNames from 'classnames';

interface HeaderTitleCellProps {
  sortColumns?: SortColumns;
  label: string;
  value: string;
  tooltipText?: string;
  fixedLeft?: boolean;
}

export const HeaderTitleCell: FC<HeaderTitleCellProps> = ({
  sortColumns,
  label,
  value,
  tooltipText,
  fixedLeft,
}) => {
  const sortedColumn = sortColumns?.find(({ column }) => column.key === value);

  return (
    <div className={classNames(styles.row, fixedLeft && styles.fixedLeftRow)}>
      <span className={styles.title}>{label}</span>
      {!!tooltipText && (
        <Tooltip placement="top" overlay={tooltipText}>
          <QuestionCircleOutlined className={styles.questionIcon} />
        </Tooltip>
      )}
      <span className={styles.sortIcon}>
        {sortedColumn?.order === 'ascend' && <ArrowUpTableSort />}
        {sortedColumn?.order === 'descend' && <ArrowDownTableSort />}
        {sortedColumn?.order !== 'descend' &&
          sortedColumn?.order !== 'ascend' && <ArrowTableSort />}
      </span>
    </div>
  );
};
