import styles from './Table.module.scss';
import { ColumnsType } from 'antd/es/table';

interface MobileTableProps<T> {
  columns: ColumnsType<T>;
  data: ReadonlyArray<T>;
  onRowClick?: (dataItem: T) => void;
  rowKeyField: string;
}

export const MobileTable = <T extends unknown>({
  data,
  columns,
  onRowClick,
  rowKeyField,
}: MobileTableProps<T>): JSX.Element => {
  return (
    <div className={styles.mobileTableView}>
      {data.map((dataRow) => (
        <div
          className={styles.mobileCollection}
          onClick={onRowClick ? () => onRowClick(dataRow) : null}
          key={dataRow[rowKeyField]}
        >
          {columns.map(({ key, title, render }, idx) => (
            <div className={styles.mobileRow} key={key}>
              <p className={styles.mobileRowTitle}>{title}</p>
              {render(dataRow[key], dataRow, idx)}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
