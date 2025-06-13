import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import SetupSkillsSelected from './elements/SetupSkillsSelected';
// import { RequestType } from '../../../../../../utils/activity/sendActivityUpdate';
import {
    changeContributorProgress,
    selectActiveDao,
    selectContributorProgress,
} from 'store/features/common/slice';
import {
    useAddReviewsMutation,
    useAddUserReviewsMutation,
} from 'store/services/Dashboard/dashboard';
import {
    useUpdateContributorProgressMutation,
    useUpdateSkillsMutation,
} from 'store/services/userProfile/userProfile';
import useInput from 'hooks/useInput';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupSubtitle from 'components/@popups/components/PopupSubtitle/PopupSubtitle';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import Button from 'ui/@buttons/Button/Button';
import TextArea from 'ui/@form/TextArea/TextArea';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
// import styles from 'components/@pages/dashboard/styles/popups/BlogsPopup.module.scss';
import styles from './SkillsAdd.module.scss';
import { ActivityEnums } from '@samudai_xyz/gateway-consumer-types';

interface AddReviewProps {
    onClose: () => void;
    data?: string[];
    changeSkills: (data: string[]) => void;
}

const AddReview: React.FC<AddReviewProps> = ({ onClose, data, changeSkills }) => {
    const [addReview] = useAddReviewsMutation();
    const [addUserReview] = useAddUserReviewsMutation();
    const [updateSkills] = useUpdateSkillsMutation();
    const { daoid } = useParams();
    const activeDAO = useTypedSelector(selectActiveDao);
    const [stars, setStars] = useState(0);
    const [link, setLink, _, clearlink] = useInput<HTMLTextAreaElement>('');

    const [skills, setSkills] = useState<string[]>(data || []);

    const currContributorProgress = useTypedSelector(selectContributorProgress);
    const dispatch = useTypedDispatch();

    const [updateContributorProgress] = useUpdateContributorProgressMutation();

    const computedForm = useMemo(() => {
        const starsValue = stars;
        const linkValue = link.trim();
        const isValid = starsValue > 0 && starsValue < 6 && linkValue !== '';

        return {
            isValid,
            starsValue,
            linkValue,
        };
    }, [stars, link]);

    const onRemoveSkills = (name: string) => {
        const filteredValues = skills.filter((skillName) => skillName !== name);
        setSkills(filteredValues);
    };

    const handleSkills = async () => {
        try {
            const res = await updateSkills({
                memberId: getMemberId(),
                skills: skills,
            })
                .unwrap()
                .then(() => {
                    if (!currContributorProgress.add_techstack && skills.length)
                        updateContributorProgress({
                            memberId: getMemberId(),
                            itemId: [ActivityEnums.NewContributorItems.ADD_TECHSTACK],
                        }).then(() => {
                            dispatch(
                                changeContributorProgress({
                                    contributorProgress: {
                                        ...currContributorProgress,
                                        add_techstack: true,
                                    },
                                })
                            );
                        });
                });
            changeSkills(skills);
            onClose();
        } catch (err) {
            toast('Failure', 5000, 'Add skills failed', '')();
        }
    };

    const validate = (text: string) => {
        const reg = /^[A-Za-z- ]+$/; // valid alphabet with space
        return reg.test(text);
    };

    return (
        <Popup className={styles.root} dataParentId="add_skills_modal" onClose={onClose}>
            <PopupTitle icon="/img/icons/setup.png" title="Your skills" />

            {/* <TextArea
        placeholder="Write your review"
        value={link}
        onChange={setLink}
        className={styles.textArea}
      /> */}
            {/* <PopupSubtitle text="Your Skills" className={styles.rateSubtitle} /> */}
            <PopupSubtitle text="Select relevant skills" className={styles.rateSubtitle} />

            {/* {skills.length === 0 ? (
                <p className={styles.empty}>Simply Search and add your skills</p>
            ) : ( */}
            <SetupSkillsSelected skills={skills} onRemoveSkill={onRemoveSkills} />
            {/* )} */}

            {/* <SetupSkillsSelected skills={skills} onRemoveSkill={onRemoveSkills} /> */}

            <PopupSubtitle text="Add more Skill" className={styles.reviewSubtitle} />

            <TextArea
                placeholder="press enter to add new skill"
                className={styles.textarea}
                value={link}
                onChange={setLink}
                onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        if (link.trim() === '') return;
                        setSkills([...skills, link]);
                        // if (validate(link.trim())) {
                        //     setSkills([...skills, link]);
                        // } else {
                        //     toast(
                        //         'Failure',
                        //         5000,
                        //         'Skill name cannot contain special characters',
                        //         ''
                        //     )();
                        // }
                        clearlink();
                    }
                }}
                data-analytics-click="skills_input"
            />
            <Button
                color="orange"
                className={styles.postBtn}
                // disabled={!computedForm.isValid}
                onClick={handleSkills}
                data-analytics-click="done_button"
            >
                <span>Done</span>
            </Button>
        </Popup>
    );
};

export default AddReview;
