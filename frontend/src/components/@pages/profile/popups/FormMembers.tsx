import React, { useState } from 'react';
import Select from 'react-select';
import { formMembersStyles } from '../utils/formMembersStyles';
import { mockup_users } from 'root/mockup/users';
import useDelayedSearch from 'hooks/useDelayedSearch';
import PopupSubtitle from 'components/@popups/components/PopupSubtitle/PopupSubtitle';
import Button from 'ui/@buttons/Button/Button';
import Checkbox from 'ui/@form/Checkbox/Checkbox';
import Highlighter from 'ui/Highlighter/Highlighter';
import PlusIcon from 'ui/SVG/PlusIcon';
import { IUser } from 'utils/types/User';
import styles from '../styles/FormMembers.module.scss';

interface FormMembersProps {
    members: IUser[];
    onToggleMember: (member: IUser) => void;
}

const FormMembers: React.FC<FormMembersProps> = ({ members, onToggleMember }) => {
    const [activeInput, setActiveInput] = useState<boolean>(false);
    const [candidats, setCandidats] = useState<IUser[]>([]);
    const searchDelay = useDelayedSearch<string>(searchCandidats, 200);
    const [value, setValue] = useState<string>('');

    function searchCandidats(value: string) {
        value = value.trim().toLowerCase();

        const candidats = value
            ? mockup_users.filter((c) => c.fullname.toLowerCase().includes(value))
            : [];

        setCandidats(candidats);
    }

    const handleToggleInput = () => {
        setActiveInput(!activeInput);
    };

    const handleChangeInput = (value: string) => {
        setValue(value);
        searchDelay(value);
    };

    return (
        <React.Fragment>
            <div className={styles.row}>
                <PopupSubtitle text="Add Members" className={styles.subtitle} />
                <Button type="button" className={styles.addBtn} onClick={handleToggleInput}>
                    <PlusIcon />
                    <span>Add</span>
                </Button>
            </div>
            {activeInput && (
                <div className={styles.field}>
                    <div className={styles.fieldInner}>
                        <Select
                            inputValue={value}
                            placeholder="Name..."
                            onInputChange={handleChangeInput}
                            classNamePrefix="rs"
                            value={null}
                            options={candidats.map((u) => ({ ...u, value: u.fullname }))}
                            styles={formMembersStyles}
                            onChange={(value) => onToggleMember(value as IUser)}
                            closeMenuOnSelect={false}
                            formatOptionLabel={(candidat: IUser) => (
                                <React.Fragment>
                                    <div className={styles.selectItemImg}>
                                        <img
                                            src={candidat.avatar}
                                            alt="avatar"
                                            className="img-cover"
                                        />
                                    </div>
                                    <p className={styles.selectItemName}>
                                        <Highlighter search={value} text={candidat.fullname} />
                                    </p>
                                    <Checkbox
                                        active={!!members.find((m) => m.id === candidat.id)}
                                        className={styles.selectCheckbox}
                                        value={candidat.id}
                                    />
                                </React.Fragment>
                            )}
                        />
                    </div>
                </div>
            )}
            {members.length > 0 && (
                <ul className={styles.candidats}>
                    {members.map((candidat) => (
                        <li className={styles.candidats_item} key={candidat.id}>
                            <img src={candidat.avatar} className="img-cover" alt="avatar" />
                        </li>
                    ))}
                </ul>
            )}
        </React.Fragment>
    );
};

export default FormMembers;
