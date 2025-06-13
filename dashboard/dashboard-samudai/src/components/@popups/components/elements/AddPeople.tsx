import React, { useRef, useState } from 'react';
import Select from 'react-select';
import { addPeopleStyles } from '../utils/addPeopleStyles';
import clsx from 'clsx';
import { members } from 'root/members';
import useDelayedSearch from 'hooks/useDelayedSearch';
import PopupSubtitle from 'components/@popups/components/PopupSubtitle/PopupSubtitle';
import Button from 'ui/@buttons/Button/Button';
import Highlighter from 'ui/Highlighter/Highlighter';
import Members from 'ui/Members/Members';
import PlusIcon from 'ui/SVG/PlusIcon';
import styles from '../styles/AddPeople.module.scss';

interface IMember {
    member_id: string;
    profile_picture: string | null;
    username: string;
}

interface AddPeopleProps {
    title: string;
    className?: string;
    users: IMember[];
    onAddUser: (user: IMember) => void;
}

const AddPeople: React.FC<AddPeopleProps> = ({ title, className, onAddUser, users }) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [list, setList] = useState<IMember[]>(members);
    const [value, setValue] = useState('');
    const [activeSelect, setActiveSelect] = useState(false);
    const [candidats, setCandidats] = useState<IMember[]>([]);
    console.log(list);

    const searchDelay = useDelayedSearch(async (value: string) => {
        const search = value.toLowerCase().trim();
        if (search !== '') {
            const v = members.filter((r) => r.username.trim().toLowerCase().includes(search));
            setList(v);
        } else {
            setList(members);
        }
        // let data = members.filter((user) => {
        //   if (users.some((u) => u.username.toLowerCase().includes(val))) {
        //     return false;
        //   }

        //   if (!user.username.toLowerCase().includes(val)) {
        //     return false;
        //   }

        //   return true;
        // });

        // setCandidats(data);
    }, 250);

    const handleChange = (value: string) => {
        setValue(value);
        searchDelay(value);
    };

    return (
        <div className={clsx(styles.root, className)}>
            <PopupSubtitle text={title} className={styles.subtitle} />
            <div className={styles.body} data-role="ap-body">
                {users.length > 0 && <Members users={users} className={styles.members} max={2} />}
                <Button
                    ref={buttonRef}
                    color="green"
                    className={styles.addBtn}
                    onClick={setActiveSelect.bind(null, !activeSelect)}
                    data-role="ap-button"
                >
                    <PlusIcon />
                    <span>Add</span>
                </Button>
                {/* Select */}
                {activeSelect && (
                    <div className={styles.select}>
                        <Select
                            value={null}
                            inputValue={value}
                            onInputChange={handleChange}
                            onChange={(value) => onAddUser(value as unknown as IMember)}
                            options={list.map((u) => ({ ...u, value: u.username }))}
                            classNamePrefix="rs"
                            placeholder="Name..."
                            styles={addPeopleStyles}
                            formatOptionLabel={(user: IMember) => (
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
                    </div>
                )}
            </div>
        </div>
    );
};

export default AddPeople;
