import React, { useState } from 'react';
import Select from 'react-select';
import Popup from '../components/Popup/Popup';
import PopupTitle from '../components/PopupTitle/PopupTitle';
import { mockup_users } from 'root/mockup/users';
import useDelayedSearch from 'hooks/useDelayedSearch';
import { formMembersStyles } from 'components/@pages/profile/utils/formMembersStyles';
import Button from 'ui/@buttons/Button/Button';
import Checkbox from 'ui/@form/Checkbox/Checkbox';
import Highlighter from 'ui/Highlighter/Highlighter';
import { IUser } from 'utils/types/User';
import { includeValue } from 'utils/use';
import styles from './ProjectInvite.module.scss';

const ProjectInvite: React.FC = () => {
    const [value, setValue] = useState<string>('');
    const [candidats, setCandidats] = useState<IUser[]>([]);
    const [inviteList, setInviteList] = useState<IUser[]>([]);
    const delayedSearch = useDelayedSearch<string>(searchCandidats, 200);

    function searchCandidats(searchValue: string) {
        const value = searchValue.trim();
        const cands = mockup_users.filter((u) => includeValue(u.fullname, value));
        setCandidats(cands);
    }

    const handleChange = (value: string) => {
        setValue(value);
        delayedSearch(value);
    };

    const onInvite = (value: IUser) => {
        if (inviteList.find((u) => u.id === value.id)) {
            setInviteList(inviteList.filter((u) => u.id !== value.id));
            return;
        }
        setInviteList([...inviteList, value]);
    };

    const handleSubmit = () => {};

    return (
        <Popup className={styles.root}>
            <PopupTitle
                className={styles.title}
                icon="/img/icons/woman-wave.png"
                title="Who do you want to invite?"
            />
            <div className={styles.inviteBox}>
                <Select
                    inputValue={value}
                    placeholder="Name..."
                    onInputChange={handleChange}
                    classNamePrefix="rs"
                    value={null}
                    options={candidats.map((u) => ({ ...u, value: u.fullname }))}
                    styles={formMembersStyles}
                    onChange={(value) => onInvite(value as IUser)}
                    closeMenuOnSelect={false}
                    formatOptionLabel={(candidat: IUser) => (
                        <React.Fragment>
                            <div className={styles.selectItemImg}>
                                <img src={candidat.avatar} alt="avatar" className="img-cover" />
                            </div>
                            <p className={styles.selectItemName}>
                                <Highlighter search={value} text={candidat.fullname} />
                            </p>
                            <Checkbox
                                active={!!inviteList.find((m) => m.id === candidat.id)}
                                className={styles.selectCheckbox}
                                value={candidat.id}
                            />
                        </React.Fragment>
                    )}
                />
            </div>
            <Button className={styles.addBtn} onClick={handleSubmit}>
                <span>Invite</span>
            </Button>
        </Popup>
    );
};

export default ProjectInvite;
