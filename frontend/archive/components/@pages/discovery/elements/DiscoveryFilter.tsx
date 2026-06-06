import { useEffect, useRef, useState } from 'react';
import { filterTeamSizes } from '../utils/filters';
import { DiscoveryFilterType, DiscoveryTeamSize } from '../utils/types';
import clsx from 'clsx';
import { ISkill, Roles, UserRating } from 'utils/types/User';
import Checkbox from 'ui/@form/Checkbox/Checkbox';
import InputRange from 'ui/@form/RangeInput/RangeInput';
import styles from '../styles/DiscoveryFilter.module.scss';
import DiscoverySkills from './DiscoverySkills';

const formatRangeValue = (value: number) => {
  if (value < 1000) return value;
  return (value / 1000).toFixed(0) + 'K';
};

interface DiscoveryFilterMeta {
  rangeBounty: {
    min: number;
    max: number;
  };
}

interface DiscoveryFilterProps {
  active: boolean;
  role: Roles;
  filter: DiscoveryFilterType;
  meta: DiscoveryFilterMeta;
  setFilter: (filter: DiscoveryFilterType) => void;
  clearFilter: () => void;
  onClose: () => void;
}

const DiscoveryFilter: React.FC<DiscoveryFilterProps> = ({
  role,
  filter,
  active,
  setFilter,
  meta,
  clearFilter,
  onClose,
}) => {
  const [localFilter, setLocalFilter] = useState({ ...filter });
  const cleared = useRef(false);

  const handleClearValue = () => {
    cleared.current = true;
    onClose();
    clearFilter();
  };

  const handleToggleSize = (size: DiscoveryTeamSize) => {
    if (localFilter.teamSize.some((s) => s.id === size.id)) {
      setLocalFilter({
        ...localFilter,
        teamSize: localFilter.teamSize.filter((s) => s.id !== size.id),
      });
    } else {
      setLocalFilter({
        ...localFilter,
        teamSize: [...localFilter.teamSize, size],
      });
    }
  };

  const handleToggleRating = (rating: UserRating) => {
    if (localFilter.rating.includes(rating)) {
      setLocalFilter({
        ...localFilter,
        rating: localFilter.rating.filter((r) => r !== rating),
      });
    } else {
      setLocalFilter({
        ...localFilter,
        rating: [...localFilter.rating, rating],
      });
    }
  };

  const handleToggleSkill = (skill: ISkill) => {
    if(localFilter.skills.some(s => s.id === skill.id)) {
      setLocalFilter({
        ...localFilter,
        skills: localFilter.skills.filter(s => s.id !== skill.id)
      });
    } else {
      setLocalFilter({
        ...localFilter,
        skills: [...localFilter.skills, skill]
      });
    }
  };

  const handleChangeBounty = (bounty: DiscoveryFilterMeta['rangeBounty']) => {
    setLocalFilter({ ...localFilter, bounty });
  };

  const handleOpportunity = () => {
    setLocalFilter({ ...localFilter, opportunity: !localFilter.opportunity });
  };

  useEffect(() => {
    if (localFilter.isAll) {
      setLocalFilter({ ...localFilter, isAll: false });
    }
  }, [localFilter]);

  useEffect(() => {
    return () => {
      if (!localFilter.isAll && !cleared.current) {
        setFilter(localFilter);
      }
    };
  }, [active]);

  return (
    <div className={styles.root}>
      <header className={styles.head}>
        <h3 className={styles.headTitle}>Filters</h3>
        <button className={styles.headClear} onClick={handleClearValue}>
          Clear All
        </button>
      </header>
      {role === Roles.ADMIN && (
        <div className={styles.body}>
          <h4 className={styles.title}>Total Bounty</h4>
          <div className={styles.adminRangeValues}>
            <span>{formatRangeValue(localFilter.bounty.min)}$</span>
            <span>{formatRangeValue(localFilter.bounty.max)}$</span>
          </div>
          <InputRange
            className={styles.adminRange}
            min={meta.rangeBounty.min}
            max={meta.rangeBounty.max}
            valueMin={localFilter.bounty.min}
            valueMax={localFilter.bounty.max}
            onChange={handleChangeBounty}
          />
          <div className={styles.adminTeam}>
            <h4 className={styles.title}>Team Size</h4>
            <ul className={styles.adminTeamList}>
              {filterTeamSizes.map((size, id) => (
                <li
                  className={styles.adminTeamItem}
                  onClick={handleToggleSize.bind(null, size)}
                  key={size.id}
                >
                  <Checkbox
                    active={localFilter.teamSize.some((s) => s.id === size.id)}
                    className={styles.checkbox}
                  />
                  <p className={styles.adminTeamName}>
                    {size.min + (size.max ? '-' + size.max : '+')}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
      {role !== Roles.ADMIN && (
        <div className={styles.body}>
          <div className={styles.userBox}>
            <button className={styles.userOpportunity} onClick={handleOpportunity}>
              <Checkbox active={localFilter.opportunity} className={styles.checkbox} />
              <p className={styles.userOpportunityName}>Open for opportunities</p>
            </button>
          </div>
          <div className={styles.userBox}>
            <ul className={styles.userRating}>
              {[UserRating.A, UserRating.B, UserRating.C].map((rating) => {
                const active = localFilter.rating.includes(rating);
                return (
                  <li
                    className={clsx(
                      styles.userRatingItem,
                      active && styles.userRatingItemActive
                    )}
                    onClick={handleToggleRating.bind(null, rating)}
                    key={rating}
                  >
                    <Checkbox active={active} className={styles.checkbox} />
                    <p
                      className={styles.userRatingName}
                      data-rating={rating.slice(0, 1).toLowerCase()}
                    >
                      Rating <strong>{rating}</strong>
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className={styles.userBox}>
            <div className={styles.title}>Skills</div>
            <DiscoverySkills 
              skills={localFilter.skills}
              toggleSkill={handleToggleSkill}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscoveryFilter;
