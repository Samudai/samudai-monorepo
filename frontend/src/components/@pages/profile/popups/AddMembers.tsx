import React, { useState } from 'react';
import FormMembers from './FormMembers';
import { IUser } from 'utils/types/User';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupSubtitle from 'components/@popups/components/PopupSubtitle/PopupSubtitle';
import Button from 'ui/@buttons/Button/Button';
import CopyInput from 'ui/@form/CopyInput/CopyInput';
import { useAddMemberMutation } from 'store/services/userProfile/clans';
import styles from '../styles/AddMembers.module.scss';

const AddMembers: React.FC = () => {
    const [members, setMembers] = useState<IUser[]>([]);
    const [addMember] = useAddMemberMutation();

    const handleSubmit = () => {
        const localData = localStorage.getItem('signUp');
        const parsedData = JSON.parse(localData!);
        const id = parsedData.member_id;
        const payload = {
            clanMember: {
                clan_id: 'cd40455c-ac28-4cca-9519-459c3e10ccd8',
                member_id: id,
                role: '',
            },
        };
        addMember(payload)
            .unwrap()
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleToggleMember = (member: IUser) => {
        if (members.findIndex((m) => m.id === member.id) !== -1) {
            setMembers(members.filter((m) => m.id !== member.id));
        } else {
            setMembers([...members, member]);
        }
    };

    return (
        <Popup className={styles.popup}>
            <div className={styles.head}>
                {/* <Members users={logos} className={styles.headMembers} hideMore max={1} /> */}
                <h3 className={styles.headTitle}>Add Members</h3>
            </div>
            <form className={styles.form}>
                <FormMembers members={members} onToggleMember={handleToggleMember} />
                <div className={styles.copy}>
                    <PopupSubtitle text="Copy invite link" className={styles.copyTitle} />
                    <CopyInput link="https://www.google.com123" className={styles.copyInput} />
                </div>
                <Button color="green" className={styles.submit} onClick={handleSubmit}>
                    <span>Add</span>
                </Button>
            </form>
        </Popup>
    );
};

export default AddMembers;
