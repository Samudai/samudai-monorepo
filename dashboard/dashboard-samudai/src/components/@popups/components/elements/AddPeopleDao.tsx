import React, { useRef, useState } from 'react';
import Select from 'react-select';
import { addPeopleStyles } from '../utils/addPeopleStyles';
import { IMember } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import { selectActiveDao } from 'store/features/common/slice';
import { useLazySearchMemberByDaoQuery } from 'store/services/Search/Search';
import useDelayedSearch from 'hooks/useDelayedSearch';
import { useTypedSelector } from 'hooks/useStore';
import PopupSubtitle from 'components/@popups/components/PopupSubtitle/PopupSubtitle';
import Button from 'ui/@buttons/Button/Button';
import Highlighter from 'ui/Highlighter/Highlighter';
import Members from 'ui/Members/Members';
import PlusIcon from 'ui/SVG/PlusIcon';
import styles from '../styles/AddPeople.module.scss';

// interface IMember {
//   member_id: string;
//   profile_picture: string | null;
//   username: string;
//   name: string;
//   // default_wallet_address?: string;
// }

interface AddPeopleProps {
    title: string;
    className?: string;
    users: IMember[];
    onAddUser: (user: IMember) => void;
    buttonText?: string;
    right?: boolean;
    dataAnalyticsId?: string;
}

const AddPeopleSearch: React.FC<AddPeopleProps> = ({
    title,
    className,
    onAddUser,
    users,
    buttonText = 'Add',
    right = false,
    dataAnalyticsId,
}) => {
    const buttonRef = useRef<HTMLButtonElement>(null);
    const activeDAO = useTypedSelector(selectActiveDao);
    const [list, setList] = useState<IMember[]>([] as IMember[]);
    const [value, setValue] = useState('');
    const [activeSelect, setActiveSelect] = useState(false);
    const [candidats, setCandidats] = useState<IMember[]>([]);
    const [searchDaoMember] = useLazySearchMemberByDaoQuery();

    const searchDelay = useDelayedSearch(async (value: string) => {
        const search = value.toLowerCase().trim();
        if (search !== '') {
            const res = await searchDaoMember({ daoId: activeDAO, value: search }).unwrap();
            setList(res?.data || ([] as IMember[]));
        } else {
            setList([] as IMember[]);
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

    // useEffect( ()=>{
    //   const fun = async ()=>{
    //      const res = await searchDaoMember({ daoId: activeDAO, value: '' }).unwrap();
    //     setUsers(res?.data || ([] as IMember[]));
    //   }
    //   fun()
    // },[])

    const handleChange = (value: string) => {
        setValue(value);
        searchDelay(value);
    };

    return (
        <div className={clsx(styles.root, className)} style={{ marginRight: right ? '15px' : '' }}>
            <PopupSubtitle text={title} className={styles.subtitle} />
            <div className={styles.body} data-role="ap-body">
                {users.length > 0 && <Members users={users} className={styles.members} max={3} />}
                <Button
                    ref={buttonRef}
                    color="green"
                    className={styles.addBtn}
                    onClick={setActiveSelect.bind(null, !activeSelect)}
                    data-analytics-click={dataAnalyticsId}
                    data-role="ap-button"
                >
                    <PlusIcon />
                    <span>{buttonText}</span>
                </Button>
                {/* Select */}
                {activeSelect && (
                    <div className={styles.select}>
                        <Select
                            value={null}
                            inputValue={value}
                            onInputChange={handleChange}
                            onChange={(value) => {
                                onAddUser(value as unknown as IMember);
                                setActiveSelect(false);
                            }}
                            options={list.map((u) => ({ ...u, value: u.username }))}
                            classNamePrefix="rs"
                            placeholder="Search Users..."
                            data-analytics-click={dataAnalyticsId}
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

export default AddPeopleSearch;
