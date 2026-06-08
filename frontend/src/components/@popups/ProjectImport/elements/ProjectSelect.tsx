import Select from 'react-select';
import clsx from 'clsx';
import colors from 'root/constants/colors';
import { selectStyles } from 'root/constants/selectStyles1';
import styles from '../styles/ProjectSelect.module.scss';

interface ProjectSelectProps<T> {
    className?: string;
    value: T | null;
    options: T[];
    onChange: (project: T) => void;
    isClearable?: boolean;
}

function ProjectSelect<T extends { id: string; name: string; value?: string }>({
    value,
    options,
    onChange,
    className,
    isClearable = false,
}: ProjectSelectProps<T>) {
    return (
        <Select
            className={clsx(styles.select, className)}
            value={value}
            options={options.map((v) => ({ ...v, value: v.id }))}
            classNamePrefix="rs"
            isClearable={isClearable}
            isSearchable={false}
            onChange={(val) => onChange(val as T)}
            styles={{
                ...selectStyles,
                singleValue: (base, state) => ({
                    ...selectStyles.singleValue?.(base, state),
                    '> p': {
                        color: colors.white,
                    },
                }),
            }}
            formatOptionLabel={(value: T) => (
                <p className={styles.name} style={{ color: 'white' }}>
                    {value.name}
                </p>
            )}
        />
    );
}

export default ProjectSelect;
