import React from 'react';
import Input from 'ui/@form/Input/Input';
import ArchiveIcon from 'ui/SVG/ArchiveIcon';
import Magnifier from 'ui/SVG/Magnifier';
import SettingsIcon from 'ui/SVG/SettingsIcon';
import styles from './styles/JobControls.module.scss';

interface JobControlsProps {
    search: string;
    savedActive: boolean;
    onSearch: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onFilter: () => void;
    onSaved: () => void;
}

const JobControls: React.FC<JobControlsProps> = ({
    search,
    onSearch,
    onFilter,
    onSaved,
    savedActive,
}) => {
    return (
        <div className={styles.controls}>
            <Input
                placeholder="Search Job"
                className={styles.input}
                value={search}
                onChange={onSearch}
                icon={<Magnifier className={styles.inputMagnifier} />}
            />
            <div className={styles.controlsRight}>
                <button className={styles.controlsBtn} onClick={onFilter}>
                    <SettingsIcon />
                    <span>Filter</span>
                </button>
                <button className={styles.controlsBtn} data-class="filter" onClick={onSaved}>
                    <ArchiveIcon className={savedActive ? styles.controlsBtnSvgFill : null} />
                    <span>Saved Jobs</span>
                </button>
            </div>
        </div>
    );
};

export default JobControls;
