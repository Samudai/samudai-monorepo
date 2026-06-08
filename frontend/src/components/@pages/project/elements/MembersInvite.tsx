import React, { useState } from 'react';
import Select from 'react-select';
import colors from 'root/constants/colors';
import { selectStyles } from 'root/constants/selectStyles';
import { members as membersData } from 'root/members';
import useDelayedSearch from 'hooks/useDelayedSearch';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupSubtitle from 'components/@popups/components/PopupSubtitle/PopupSubtitle';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import Button from 'ui/@buttons/Button/Button';
import CloseButton from 'ui/@buttons/Close/Close';
import Highlighter from 'ui/Highlighter/Highlighter';
import styles from '../styles/MembersInvite.module.scss';

type User = {
    member_id: string;
    username: string;
    profile_picture: string | null;
};

interface MembersInviteProps {
    members: User[];
    onClose: () => void;
}

const MembersInvite: React.FC<MembersInviteProps> = ({ members, onClose }) => {
    const [value, setValue] = useState('');
    const [list, setList] = useState<User[]>(membersData);

    const searchDelay = useDelayedSearch(async (value: string) => {
        const search = value.toLowerCase().trim();
        if (search !== '') {
            const v = membersData.filter((r) => r.username.trim().toLowerCase().includes(search));
            setList(v);
        } else {
            setList(membersData);
        }
    }, 250);

    const handleChange = (val: string) => {
        setValue(val);
        searchDelay(val);
    };

    return (
        <Popup className={styles.root} onClose={onClose}>
            <PopupTitle icon="/img/icons/woman-wave.png" title="Add Members" />
            <Select
                value={null}
                inputValue={value}
                onInputChange={handleChange}
                className={styles.select}
                classNamePrefix="rs"
                placeholder="Name..."
                styles={{
                    ...selectStyles,
                    input: (base, state) => ({
                        ...base,
                        ...selectStyles.input?.(base, state),
                        color: colors.white,
                    }),
                    dropdownIndicator: () => ({ display: 'none' }),
                }}
                options={list.map((u) => ({ ...u, value: u.username }))}
                formatOptionLabel={(user: User) => (
                    <React.Fragment>
                        <div className={styles.selectIcon}>
                            <img
                                src={user.profile_picture || '/img/icons/user-4.png'}
                                alt="user"
                                className="img-cover"
                            />
                        </div>
                        <p className={styles.selectName}>
                            <Highlighter search={value} text={user.username} />
                        </p>
                    </React.Fragment>
                )}
            />
            <PopupSubtitle text="Members" className={styles.subtitle} />
            <ul className={styles.members}>
                {members.map((member) => (
                    <li key={member.member_id} className={styles.membersItem}>
                        <div className={styles.membersImg}>
                            <img
                                src={member.profile_picture || '/img/icons/user-4.png'}
                                alt="user"
                                className="img-cover"
                            />
                        </div>
                        <p className={styles.membersName}>{member.username}</p>
                        <CloseButton className={styles.membersRemoveBtn} />
                    </li>
                ))}
            </ul>
            <Button color="orange" className={styles.doneBtn} onClick={onClose}>
                <span>Done</span>
            </Button>
        </Popup>
    );
};

export default MembersInvite;
