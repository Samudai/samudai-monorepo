import { useState } from 'react';
import Select from 'react-select';
import { selectRoleStyles } from './utils/select-role.styles';
import { members } from 'root/members';
import useDelayedSearch from 'hooks/useDelayedSearch';
import Highlighter from 'ui/Highlighter/Highlighter';
import styles from './styles/SelectMembers.module.scss';

interface SelectMembersProps {}
interface IMember {
    member_id: string;
    profile_picture: string | null;
    username: string;
}

const SelectMembers1: React.FC<SelectMembersProps> = () => {
    const [search, setSearch] = useState('');
    const [list, setList] = useState<IMember[]>(members);

    const searchDelay = useDelayedSearch((value: string) => {
        const search = value.toLowerCase().trim();
        if (search === '') {
            setList([]);
            return;
        }

        setList(members.filter((u) => u.username.toLowerCase().includes(search)));
    }, 200);

    const handleSearch = (value: string) => {
        setSearch(value);
        searchDelay(value);
    };

    return (
        <div className={styles.root}>
            <h3 className={styles.suptitle}>Members</h3>
            <Select
                classNamePrefix="rs"
                inputValue={search}
                isMulti={true}
                isSearchable
                isClearable
                onInputChange={handleSearch}
                options={list.map((item) => ({ ...item, value: item.username }))}
                placeholder=""
                styles={selectRoleStyles}
                formatOptionLabel={(user: IMember) => (
                    <div className={styles.content}>
                        <div className={styles.contentImg} data-select-avatar>
                            <img
                                src={user.profile_picture || '/img/icons/user-4.png'}
                                alt="avatar"
                                className="img-cover"
                            />
                        </div>
                        <p className={styles.contentName} data-select-name>
                            <Highlighter search={search} text={user.username} />
                        </p>
                    </div>
                )}
            />
        </div>
    );
};

export default SelectMembers1;
