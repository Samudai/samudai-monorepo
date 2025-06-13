import { useState } from 'react';
import { IUser } from 'utils/types/User';
import useInput from 'hooks/useInput';
import Popup from 'components/@popups/components/Popup/Popup';
import Button from 'ui/@buttons/Button/Button';
import CopyInput from 'ui/@form/CopyInput/CopyInput';
import MarkIcon from 'ui/SVG/MarkIcon';
import Input from 'ui/@form/Input/Input';
import FormMembers from './FormMembers';
import rootStyles from '../styles/AddMembers.module.scss';
import { ProjectEnums } from '@samudai_xyz/gateway-consumer-types';
import { useCreateClanMutation } from 'store/services/userProfile/clans';
import { createClanRequest } from 'store/services/userProfile/model';
import styles from '../styles/ClanSetup.module.scss';

enum Tabs {
    Form,
    Complete,
}

interface ClanSetupProps {
    onClose: () => void;
}

const ClanSetup: React.FC<ClanSetupProps> = ({ onClose }) => {
    const [name, setName] = useInput('');
    const [members, setMembers] = useState<IUser[]>([]);
    const [activeTab, setActiveTab] = useState<Tabs>(Tabs.Form);
    const [createClan] = useCreateClanMutation();

    const handleToggleMember = (member: IUser) => {
        if (members.findIndex((m) => m.id === member.id) !== -1) {
            setMembers(members.filter((m) => m.id !== member.id));
        } else {
            setMembers([...members, member]);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const localData = localStorage.getItem('signUp');
            const parsedData = JSON.parse(localData!);
            const id = parsedData.member_id;
            const payload: createClanRequest = {
                clan: {
                    name,
                    avatar: '',
                    created_by: id,
                    visibility: ProjectEnums.Visibility.PUBLIC,
                },
            };
            createClan(payload);
            setActiveTab(Tabs.Complete);
        } catch (err) {
            console.error(err);
        }
        // setActiveTab(Tabs.Complete);
    };

    const handleComplete = () => {
        onClose();
    };

    return (
        <Popup className={styles.popup}>
            <div className={rootStyles.head}>
                {/* <Members users={logos} className={rootStyles.headMembers} hideMore max={4} /> */}
                <h3 className={rootStyles.headTitle}>Сontributor Clan Set Up</h3>
            </div>
            {activeTab === Tabs.Form && (
                <form className={styles.form} onSubmit={handleSubmit}>
                    <Input
                        title="Name"
                        className={styles.input}
                        value={name}
                        placeholder="Name..."
                        onChange={setName}
                    />
                    <FormMembers members={members} onToggleMember={handleToggleMember} />
                    <Button type="submit" color="green" className={styles.createBtn}>
                        <span>Create Clan</span>
                    </Button>
                </form>
            )}
            {activeTab === Tabs.Complete && (
                <div className={styles.complete}>
                    <div className={styles.completeMark}>
                        <MarkIcon />
                    </div>
                    <p className={styles.completeThanks}>
                        <span>Thank you!</span>
                        <span>Clan created, copy invite link</span>
                    </p>
                    <CopyInput className={styles.completeCopy} link="https://www.google.com" />
                    <Button color="green" className={styles.completeBtn} onClick={handleComplete}>
                        <span>Complete</span>
                    </Button>
                </div>
            )}
        </Popup>
    );
};

export default ClanSetup;
