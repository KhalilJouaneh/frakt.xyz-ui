import { SearchInput } from '@frakt/components/SearchInput';
import { Search } from '@frakt/components/Table/Search';
import { ChangeEvent, FC } from 'react';

interface SearchCellProps {
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeHolderText?: string;
  className?: string;
}

const SearchCell: FC<SearchCellProps> = ({ onChange }) => {
  return <Search onChange={onChange} />;
};

export default SearchCell;
