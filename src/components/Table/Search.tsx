import { Input } from 'antd';
import { ChangeEvent, FC } from 'react';
import styles from './Table.module.scss';
import { SearchOutlined } from '@ant-design/icons';
import classNames from 'classnames';

interface SearchProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeHolderText?: string;
  className?: string;
}

export const Search: FC<SearchProps> = ({
  onChange,
  placeHolderText = 'search',
  className = '',
}) => {
  return (
    <div className={classNames(styles.search, className)}>
      <Input
        size="large"
        placeholder={placeHolderText}
        prefix={<SearchOutlined className={styles.prefix} />}
        onChange={onChange}
      />
    </div>
  );
};
