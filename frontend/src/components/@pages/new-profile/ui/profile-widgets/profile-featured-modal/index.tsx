import React, { useState } from 'react';
import { ActivityEnums, FeaturedProjects } from '@samudai_xyz/gateway-consumer-types';
import { updateFeaturedProjectsRequest } from 'store/services/userProfile/model';
import {
    useUpdateContributorProgressMutation,
    useUpdateFeaturedProjectsMutation,
} from 'store/services/userProfile/userProfile';
import { useObjectState } from 'hooks/use-object-state';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupSubtitle from 'components/@popups/components/PopupSubtitle/PopupSubtitle';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import Button from 'ui/@buttons/Button/Button';
import Input from 'ui/@form/Input/Input';
import TextArea from 'ui/@form/TextArea/TextArea';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import css from './profile-featured-modal.module.scss';
import { useTypedSelector, useTypedDispatch } from 'hooks/useStore';
import { selectContributorProgress, changeContributorProgress } from 'store/features/common/slice';

interface ProfileFeaturedModalProps {
    data: FeaturedProjects[];
    onClose?: () => void;
    callback?: (data: FeaturedProjects[]) => void;
}

interface Inputs {
    link: string;
    about: string;
}

export const ProfileFeaturedModal: React.FC<ProfileFeaturedModalProps> = ({
    data,
    onClose,
    callback,
}) => {
    const [state, setState] = useObjectState<Inputs>({
        link: '',
        about: '',
    });
    const [btnLoading, setBtnLoading] = useState<boolean>(false);

    const currContributorProgress = useTypedSelector(selectContributorProgress);
    const dispatch = useTypedDispatch();

    const [updateContributorProgress] = useUpdateContributorProgressMutation();

    const [updateFeaturedProjects] = useUpdateFeaturedProjectsMutation();

    const handleSubmit = async () => {
        if (!state.link) {
            return toast('Attention', 5000, 'Please add link to the project', '')();
        }
        if (!state.about) {
            return toast('Attention', 5000, 'Please add about the project', '')();
        }

        const newData = [...data, { url: state.link, about: state.about }];
        const payload: updateFeaturedProjectsRequest = {
            member_id: getMemberId(),
            featured_projects: newData,
        };

        setBtnLoading(true);

        await updateFeaturedProjects(payload)
            .unwrap()
            .then(() => {
                toast('Success', 5000, 'Featured projects successfully updated', '')();
                callback?.(newData);
                onClose?.();
                if (!currContributorProgress.featured_projects)
                    updateContributorProgress({
                        memberId: getMemberId(),
                        itemId: [ActivityEnums.NewContributorItems.FEATURED_PROJECTS],
                    }).then(() => {
                        dispatch(
                            changeContributorProgress({
                                contributorProgress: {
                                    ...currContributorProgress,
                                    featured_projects: true,
                                },
                            })
                        );
                    });
            })
            .catch(() => {
                toast('Failure', 5000, 'Failed to update featured projects', '')();
            })
            .finally(() => {
                setBtnLoading(false);
            });
    };

    return (
        <Popup className={css.root} dataParentId="add_projects_modal" onClose={onClose}>
            <PopupTitle icon="/img/icons/setup.png" title="Featured Projects" />

            <div className={css.spacer} />

            <PopupSubtitle className={css.subtitle} text="Add Link to the Projects" />

            <Input
                value={state.link}
                onChange={(ev) => setState({ link: ev.target.value })}
                placeholder="behance/dribbble/github"
                data-analytics-click="link_input"
            />

            <div className={css.spacer_less} />

            <PopupSubtitle className={css.subtitle} text="Add About" />

            <TextArea
                className={css.textarea}
                value={state.about}
                onChange={(ev) => setState({ about: ev.target.value })}
                placeholder="About the project"
                data-analytics-click="about_project_input"
            />

            <Button
                className={css.submit_btn}
                color="orange"
                onClick={handleSubmit}
                disabled={btnLoading}
                data-analytics-click="submit_button"
            >
                <span>Done</span>
            </Button>
        </Popup>
    );
};
