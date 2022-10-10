import { FC } from 'react';
import styles from './FilterCollections.module.scss';

interface FilterCollectionsProps {
  options: any[];
  selectedCollections: string[];
  setSelectedCollections: any;
}

const FilterCollections: FC<FilterCollectionsProps> = ({
  options,
  selectedCollections,
  setSelectedCollections,
}) => {
  const totalCollections = selectedCollections.length;

  const handleCheck = (e): void => {
    const isChecked = e.target.checked;
    const checkedValue = e.target.value;

    let updatedList = [...selectedCollections];

    if (isChecked) {
      updatedList = [...selectedCollections, checkedValue];
    } else {
      updatedList.splice(selectedCollections.indexOf(checkedValue), 1);
    }
    setSelectedCollections(updatedList);
  };

  const onClearCollections = (): void => {
    setSelectedCollections([]);
  };

  return (
    <div className={styles.filterCollections}>
      <div className={styles.filtersContentHeader}>
        <p className={styles.collectionsCounter}>
          Collections: {totalCollections}
        </p>
        <p onClick={onClearCollections} className={styles.clearCollections}>
          Clear
        </p>
      </div>
      <div className={styles.filtersContent}>
        {options.map(({ value }, idx) => (
          <div className={styles.checkbox} key={idx}>
            <label>
              <input
                value={value}
                onChange={handleCheck}
                type="checkbox"
                checked={!!selectedCollections.includes(value)}
              />
              <p>{value}</p>
              <span className={styles.checkboxInput}></span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilterCollections;
