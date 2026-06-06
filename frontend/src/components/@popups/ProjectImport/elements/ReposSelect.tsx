import { Dispatch, SetStateAction } from 'react';
import Select from 'react-select';
import colors from 'root/constants/colors';
import { selectStyles } from 'root/constants/selectStyles';
import styles from '../styles/ProjectSelect.module.scss';

interface ReposSelectProps {
    className?: string;
    options: string[];
    setRepos: Dispatch<SetStateAction<string[]>>;
    isSingle?: boolean;
}

const ReposSelect: React.FC<ReposSelectProps> = ({ options, setRepos, className, isSingle }) => {
    const handleChange = (e: any) => {
        setRepos(Array.isArray(e) ? e?.map((x) => x.value) : []);
    };
    return (
        <Select
            className={styles.select}
            defaultValue={null}
            options={(options || [])?.map((x) => ({ value: x, label: x }))}
            classNamePrefix="rs"
            isSearchable={false}
            isMulti={!isSingle}
            maxMenuHeight={100}
            onChange={handleChange}
            styles={{
                ...selectStyles,
                singleValue: (base, state) => ({
                    ...selectStyles.singleValue?.(base, state),
                    '> p': {
                        color: colors.white,
                    },
                }),
            }}
            formatOptionLabel={({ value }: any) => (
                <p className={styles.name} style={{ color: 'white' }}>
                    {value}
                </p>
            )}
        />
    );
};

export default ReposSelect;
