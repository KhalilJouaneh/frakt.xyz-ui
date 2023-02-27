import { FC } from 'react';
import classNames from 'classnames';

import { QuestionCircleOutlined } from '@ant-design/icons';
import Tooltip from '@frakt/components/Tooltip';
import {
  ArrowDownTableSort,
  ArrowTableSort,
  ArrowUpTableSort,
} from '@frakt/icons';

import styles from './TableCells.module.scss';
import { SortColumns } from '../columns';

interface HeaderTitleCellProps {
  sortColumns?: SortColumns;
  label: string;
  value: string;
  tooltipText?: string;
  fixedLeft?: boolean;
  isMobile?: boolean;
}

export const HeaderTitleCell: FC<HeaderTitleCellProps> = ({
  sortColumns,
  label,
  value,
  tooltipText,
  fixedLeft,
  isMobile,
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
      <span
        className={classNames(styles.sortIcon, {
          [styles.sortIconMobile]: isMobile,
        })}
      >
        {sortedColumn?.order === 'ascend' && <ArrowUpTableSort />}
        {sortedColumn?.order === 'descend' && <ArrowDownTableSort />}
        {sortedColumn?.order !== 'descend' &&
          sortedColumn?.order !== 'ascend' && <ArrowTableSort />}
      </span>
    </div>
  );
};
