import { FC } from 'react';

import { QuestionCircleOutlined } from '@ant-design/icons';
import Tooltip from '@frakt/components/Tooltip';
import {
  ArrowDownTableSort,
  ArrowTableSort,
  ArrowUpTableSort,
} from '@frakt/icons';

import styles from './TableCells.module.scss';

interface HeaderTitleCellProps {
  sortColumns: any;
  label: string;
  value: string;
  tooltipText?: string;
}

export const HeaderTitleCell: FC<HeaderTitleCellProps> = ({
  sortColumns,
  label,
  value,
  tooltipText,
}) => {
  const sortedColumn = sortColumns?.find(({ column }) => column.key === value);

  return (
    <div className={styles.row}>
      <span className={styles.title}>{label}</span>
      {!!tooltipText && (
        <Tooltip placement="top" overlay={tooltipText}>
          <QuestionCircleOutlined className={styles.questionIcon} />
        </Tooltip>
      )}
      {sortedColumn?.order === 'ascend' && <ArrowUpTableSort />}
      {sortedColumn?.order === 'descend' && <ArrowDownTableSort />}
      {!sortedColumn?.order && <ArrowTableSort />}
    </div>
  );
};
