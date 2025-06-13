import React, { useState } from 'react';
import Select from 'react-select';
import { FilterOptionOption } from 'react-select/dist/declarations/src/filters';
import colors from 'root/constants/colors';
import { selectStyles } from 'root/constants/selectStyles';
import { mockup_users } from 'root/mockup/users';
import useDelayedSearch from 'hooks/useDelayedSearch';
import Highlighter from 'ui/Highlighter/Highlighter';
import { IUser } from 'utils/types/User';
import styles from './styles/ParticipantsAdd.module.scss';

interface ParticipantsAddProps {
    participants: IUser[];
    toggleParticipants: (user: IUser) => void;
}

const ParticipantsAdd: React.FC<ParticipantsAddProps> = ({ participants, toggleParticipants }) => {
    const [search, setSearch] = useState('');
    const [candidats, setCandidats] = useState<IUser[]>([]);

    const delayedSearch = useDelayedSearch((search: string) => {
        const value = search.trim().toLowerCase();
        const candidats = mockup_users.filter((u) => u.fullname.toLowerCase().includes(value));
        setCandidats(candidats);
    }, 200);

    const handleChange = (value: string) => {
        setSearch(value);
        delayedSearch(value);
    };

    const customFilter = (option: FilterOptionOption<IUser>, inputValue: string) => {
        return option.data.fullname.toLowerCase().includes(inputValue.trim().toLowerCase());
    };

    return (
        <Select
            className={styles.root}
            value={[]}
            options={candidats}
            onChange={(value) => toggleParticipants(value as IUser)}
            classNamePrefix="rs"
            inputValue={search}
            onInputChange={handleChange}
            filterOption={customFilter}
            formatOptionLabel={(data: IUser) => (
                <div className={styles.user}>
                    <div className={styles.userImg}>
                        <img src={data.avatar} alt="avatar" />
                    </div>
                    <p className={styles.userName}>
                        <Highlighter search={search} text={data.fullname} />
                    </p>
                </div>
            )}
            styles={{
                ...selectStyles,
                dropdownIndicator: () => ({
                    display: 'none',
                }),
                input: (base, state) => ({
                    ...selectStyles.input?.(base, state),
                    color: colors.green,
                }),
                menuList: (base, state) => ({
                    ...selectStyles.menuList?.(base, state),
                    maxHeight: 150,
                    overflow: 'hidden auto',
                }),
            }}
        />
    );
};

export default ParticipantsAdd;
