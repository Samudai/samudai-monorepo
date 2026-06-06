import React, { useState } from 'react';
import { useUpdateDomainTagsForWorkMutation } from 'store/services/userProfile/userProfile';
import useInput from 'hooks/useInput';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupSubtitle from 'components/@popups/components/PopupSubtitle/PopupSubtitle';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import SetupSkillsSelected from 'components/@signup/ProfileSetup/steps/SetupSkills/elements/SetupSkillsSelected';
import Button from 'ui/@buttons/Button/Button';
import TextArea from 'ui/@form/TextArea/TextArea';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import css from './profile-works-modal.module.scss';

interface ProfileWorksModalProps {
    data: string[];
    onUpdate: (works: string[]) => void;
    onClose?: () => void;
}

export const ProfileWorksModal: React.FC<ProfileWorksModalProps> = ({
    data,
    onUpdate,
    onClose,
}) => {
    const [link, setLink, _, clearlink] = useInput<HTMLTextAreaElement>('');
    const [works, setWorks] = useState<string[]>(data || []);

    const [updateDomainTags] = useUpdateDomainTagsForWorkMutation();

    const onRemoveTags = (name: string) => {
        const filteredValues = works.filter((work) => work !== name);
        setWorks(filteredValues);
    };

    const validate = (text: string) => {
        const reg = /^[A-Za-z- ]+$/; // valid alphabet with space
        return reg.test(text);
    };

    const handleTags = async () => {
        console.log(works);
        onUpdate(works);
        await updateDomainTags({
            member_id: getMemberId(),
            domain_tags_for_work: works,
        })
            .unwrap()
            .then(() => onClose?.())
            .catch(() => {
                onUpdate(data);
                toast('Failure', 5000, 'Add Work tags failed', '')();
            });
    };

    return (
        <Popup className={css.works} dataParentId="profile_works_modal" onClose={onClose}>
            <PopupTitle icon="/img/icons/setup.png" title="Open to Work" />

            <PopupSubtitle text="Select relevant roles" className={css.subtitle} />

            {/* {works.length === 0 ? (
                <p className={css.empty}>Simply Search and add what you’re open to work for.</p>
            ) : ( */}
            <SetupSkillsSelected isOpenWork skills={works} onRemoveSkill={onRemoveTags} hideCross />
            {/* )} */}

            <PopupSubtitle text="Add new roles" className={css.subtitle} />

            <TextArea
                placeholder="press enter to add new roles."
                className={css.textarea}
                value={link}
                onChange={setLink}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        if (link.trim() === '') return;
                        if (validate(link.trim())) {
                            setWorks([...works, link]);
                        } else {
                            toast('Failure', 5000, 'Tags cannot contain special characters', '')();
                        }
                        clearlink();
                    }
                }}
                data-analytics-click="add_new_roles_input"
            />
            <Button
                color="orange"
                className={css.postBtn}
                onClick={handleTags}
                data-analytics-click="done_button"
            >
                <span>Done</span>
            </Button>
        </Popup>
    );
};
