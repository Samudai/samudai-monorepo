import React, { useState } from 'react';
import Popup from '../components/Popup/Popup';
import PopupSubtitle from '../components/PopupSubtitle/PopupSubtitle';
import PopupTitle from '../components/PopupTitle/PopupTitle';
import useInput from 'hooks/useInput';
import Button from 'ui/@buttons/Button/Button';
import DynamicInput from 'ui/@form/DynamicInput/DynamicInput';
import Input from 'ui/@form/Input/Input';
import TextArea from 'ui/@form/TextArea/TextArea';
import styles from './CollaborateRequest.module.scss';
import { toast } from 'utils/toast';
import { useCreateCollaborationMutation } from 'store/services/Dao/dao';
import { createCollaborationRequest } from 'store/services/Dao/model';
import { getMemberId } from 'utils/utils';
import { DAOEnums } from '@samudai_xyz/gateway-consumer-types';

interface CollaborateRequestProps {
    fromDaoId: string;
    toDaoId: string;
    onClose?: () => void;
}

const CollaborateRequest: React.FC<CollaborateRequestProps> = ({ fromDaoId, toDaoId, onClose }) => {
    const [title, setTitle] = useInput('');
    const [guild, setGuild] = useInput('');
    const [text, setText] = useInput<HTMLTextAreaElement>('');
    const [requirements, setRequirements] = useState<string[]>([]);
    const [benefit, setBenefit] = useInput('');

    const [createCollaboration] = useCreateCollaborationMutation();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!title) return toast('Attention', 5000, 'Title is required', '')();
        if (!guild) return toast('Attention', 5000, 'Scope of Collaboration is required', '')();
        if (!text) return toast('Attention', 5000, 'Description is required', '')();
        if (!requirements.length)
            return toast('Attention', 5000, 'Requirements are required', '')();
        if (!benefit)
            return toast('Attention', 5000, 'Please mention how would this benefit us?', '')();

        const payload: createCollaborationRequest = {
            collaboration: {
                applying_member_id: getMemberId(),
                from_dao_id: fromDaoId,
                to_dao_id: toDaoId,
                status: DAOEnums.InviteStatus.PENDING,
                title: title,
                scope: guild,
                description: text,
                requirements: [...requirements],
                benefits: benefit,
            },
        };

        await createCollaboration(payload)
            .unwrap()
            .then(() => {
                toast('Success', 5000, 'Collaboration request sent successfully', '')();
                onClose?.();
            })
            .catch((err) => {
                toast('Failure', 5000, 'Failed to send Collaboration request', '')();
                console.log(err);
            });
    };

    return (
        <Popup className={styles.root}>
            <PopupTitle icon="/img/icons/handshake.png" title="Request to Collaborate" />
            <form className={styles.form} onSubmit={handleSubmit}>
                <Input
                    title="Title*"
                    value={title}
                    onChange={setTitle}
                    placeholder="Type here..."
                />
                <Input
                    title="Scope of Collaboration (eg Marketing, Development)*"
                    value={guild}
                    className={styles.margin}
                    onChange={setGuild}
                    placeholder="Type here..."
                />
                <PopupSubtitle className={styles.subtitle} text="Description*" />
                <TextArea
                    className={styles.textarea}
                    value={text}
                    onChange={setText}
                    placeholder="Type here..."
                    cancelAutoHeight
                />
                <DynamicInput
                    title={'Requirements*'}
                    className={styles.margin}
                    values={requirements}
                    onChangeValues={setRequirements}
                />
                <Input
                    title="How would this benefit us?*"
                    value={benefit}
                    className={styles.margin}
                    onChange={setBenefit}
                    placeholder="Type here..."
                />
                <Button color="green" className={styles.submitBtn} type="submit">
                    <span>Save</span>
                </Button>
            </form>
        </Popup>
    );
};

export default CollaborateRequest;
