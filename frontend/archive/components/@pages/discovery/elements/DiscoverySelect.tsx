import { DiscoverySortType } from '../utils/types';
import Select from 'ui/@form/Select/Select';
import styles from '../styles/DiscoverySelect.module.scss';

interface DiscoverySelectProps {
  active: DiscoverySortType;
  items: DiscoverySortType[];
  handleChange: (item: DiscoverySortType) => void;
}

const DiscoverySelect: React.FC<DiscoverySelectProps> = ({
  active,
  items,
  handleChange,
}) => {
  return (
    <Select className={styles.root} closeClickItem closeClickOuside>
      <Select.Button className={styles.btn} arrow>
        <div className={styles.content}>
          <p className={styles.name}>{active.name}</p>
        </div>
      </Select.Button>
      <Select.List className={styles.list}>
        {items.map((item) => (
          <Select.Item
            className={styles.item}
            key={item.name}
            onClick={handleChange.bind(null, item)}
          >
            <div className={styles.content}>
              <p className={styles.name}>{item.name}</p>
            </div>
          </Select.Item>
        ))}
      </Select.List>
    </Select>
  );
};

export default DiscoverySelect;
