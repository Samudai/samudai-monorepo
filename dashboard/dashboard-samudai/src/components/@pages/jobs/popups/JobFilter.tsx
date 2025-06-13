import { useEffect, useRef, useState } from 'react';
import Checkbox from 'ui/@form/Checkbox/Checkbox';
import RangeInput from 'ui/@form/RangeInput/RangeInput';
import { beautifySum } from 'utils/format';
import { JobFilter as FilterType, JobRole } from 'utils/types/Jobs';
import { toggleArrayItem } from 'utils/use';
import styles from '../styles/JobFilter.module.scss';

interface JobFilterProps {
    data: {
        filter: FilterType;
        bounty: {
            min: number;
            max: number;
        };
    };
    active: boolean;
    setData: (f: FilterType) => void;
    clearFilter: () => void;
}

const JobFilter: React.FC<JobFilterProps> = ({ data, setData, active, clearFilter }) => {
    const rendered = useRef(false);
    const cleared = useRef(false);
    const [filter, setFilter] = useState(data.filter);

    // const handleChangeType = (type: string) => {
    //   setFilter({ ...filter, type: toggleArrayItem(filter.type, type) });
    // };

    const handleClear = () => {
        cleared.current = true;
        clearFilter();
    };

    const handleCHangeRole = (role: string) => {
        setFilter({ ...filter, all: false, role: toggleArrayItem(filter.role, role) });
    };

    const handleChangeBounty = ({ min, max }: { min: number; max: number }) => {
        setFilter({ ...filter, all: false, bounty: { min, max } });
    };

    useEffect(() => {
        if (rendered.current && !cleared.current) {
            setData(filter);
        }
        rendered.current = true;
    }, [active]);

    return (
        <div className={styles.root}>
            <header className={styles.head}>
                <h3 className={styles.headTitle}>Filters</h3>
                <button className={styles.headClearBtn} onClick={handleClear}>
                    Clear All
                </button>
            </header>
            <div className={styles.body}>
                {/* <div className={styles.group}>
          <h4 className={styles.title}>Job Type</h4>
          <ul className={styles.type}>
            {[...Object.values(JobFormat), 'All'].map((type) => (
              <li
                className={styles.item}
                onClick={() => handleChangeType(type)}
                key={type}
              >
                <Checkbox
                  active={filter.type.includes(type)}
                  className={styles.checkbox}
                />
                <span className={styles.name}>{type}</span>
              </li>
            ))}
          </ul>
        </div> */}
                <div className={styles.group}>
                    <h4 className={styles.title}>Open to</h4>
                    <ul className={styles.openTo}>
                        {Object.values(JobRole).map((role) => (
                            <li
                                className={styles.item}
                                onClick={handleCHangeRole.bind(null, role)}
                                key={role}
                            >
                                <Checkbox
                                    active={filter.role.includes(role)}
                                    className={styles.checkbox}
                                />
                                <span className={styles.name}>{role}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className={styles.group}>
                    <h4 className={styles.title}>Bounty</h4>
                    <div className={styles.bounty}>
                        <div className={styles.bountyRange}>
                            <span>${beautifySum(filter.bounty.min)}</span>
                            <span>${beautifySum(filter.bounty.max)}</span>
                        </div>
                        <RangeInput
                            min={data.bounty.min}
                            max={data.bounty.max}
                            valueMin={filter.bounty.min}
                            valueMax={filter.bounty.max}
                            onChange={handleChangeBounty}
                            className={styles.bountyInput}
                        />
                    </div>
                </div>
                {/* <div className={styles.group}>
          <h4 className={styles.title}>Experience</h4>
          <ul className={styles.exp}>
            {['Less than 1 Year', '1-2 Year', '3-5 Year', '+5 Year'].map((exp) => (
              <li className={styles.item} key={exp}>
                <Checkbox active={false} className={styles.checkbox} />
                <span className={styles.name}>{exp}</span>
              </li>
            ))}
          </ul>
        </div> */}
            </div>
        </div>
    );
};

export default JobFilter;
