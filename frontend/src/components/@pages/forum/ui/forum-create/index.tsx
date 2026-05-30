import React from 'react';
import { useDiscussionCreate } from '../../lib/hooks';
import { Descendant } from 'slate';
import { tags } from 'store/features/discussion/slice';
import { useObjectState } from 'hooks/use-object-state';
import usePopup from 'hooks/usePopup';
import { useTypedSelector } from 'hooks/useStore';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import { Editor, deserialize, serialize } from 'components/editor';
import MultiSelect from 'components/multi-select';
import Button from 'ui/@buttons/Button/Button';
import Input from 'ui/@form/Input/Input';
import { DiscussionType } from 'utils/types/Discussions';
import { getRawText } from 'utils/utils';
import { ProjectsMember } from 'components/@pages/projects/ui/projects-member';
import { IMember } from 'utils/types/User';
import css from './forum-create.module.scss';

interface ForumCreateProps {
    edit?: InputsEdit;
    onClose: () => void;
    refetchDiscussions?: () => void;
}

interface InputsEdit {
    title: string;
    description: string;
    participants: IMember[];
    tags: string[];
    category?: string;
    closed?: boolean;
    discussion_id?: string;
    visibility: string;
}

interface Inputs {
    title: string;
    description: Descendant[];
    participants: IMember[];
    tags: string[];
    category?: string;
    closed?: boolean;
    discussion_id?: string;
    visibility: string;
}

export const ForumCreate: React.FC<ForumCreateProps> = ({ edit, onClose, refetchDiscussions }) => {
    const inviteModal = usePopup();
    const tagList = useTypedSelector(tags);
    const handleCreate = useDiscussionCreate(
        () => {
            refetchDiscussions?.();
            onClose();
        },
        edit?.discussion_id
    );

    const [state, setState] = useObjectState<Inputs>(
        edit
            ? {
                  title: edit.title,
                  description: deserialize(edit.description),
                  participants: edit.participants,
                  tags: edit.tags,
                  category: edit.category,
                  closed: edit.closed,
                  discussion_id: edit.discussion_id,
                  visibility: edit.visibility,
              }
            : {
                  title: '',
                  description: deserialize(''),
                  participants: [],
                  tags: [DiscussionType.Community],
                  visibility: 'public',
              }
    );

    const onSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        handleCreate(
            {
                ...state,
                description: serialize(state.description),
                description_raw: getRawText(state.description),
            },
            Boolean(edit)
        );
    };

    return (
        <>
            <Popup className={css.create} onClose={onClose} dataParentId="new_forum_modal">
                <PopupTitle
                    icon="/img/icons/write.png"
                    title={
                        edit ? (
                            <>
                                <strong>Edit</strong> Forum
                            </>
                        ) : (
                            <>
                                Create <strong>New</strong> Forum
                            </>
                        )
                    }
                />
                <form className={css.create_form} onSubmit={onSubmit}>
                    <Input
                        value={state.title}
                        onChange={(ev) => setState({ title: ev.target.value })}
                        className={css.create_input}
                        title="Title"
                        data-analytics-click="input_title"
                    />
                    <div className={css.create_input}>
                        <h3 className={css.create_input_title}>Description</h3>
                        <Editor
                            readOnly={false}
                            placeholder="Enter your text"
                            className={css.create_input_editor}
                            value={state.description}
                            onChange={(value) => {
                                setState({ description: value });
                            }}
                            dataAnalyticsEditable="edit_forum_details_description"
                            dataAnalyticsReadOnly="forum_details_description"
                        />
                    </div>
                    {!edit && (
                        <div className={css.create_input}>
                            <div className={css.create_participants}>
                                <div className={css.create_participants_row}>
                                    <p className={css.create_participants_title}>Participants</p>
                                    {/* <Button
                                        className={css.create_participants_addBtn}
                                        onClick={inviteModal.open}
                                        data-analytics-click="add_participant_button"
                                    >
                                        <PlusIcon />
                                        <span>Add</span>
                                    </Button> */}
                                </div>
                                {state.participants && (
                                    <div className={css.create_participants_list}>
                                        <ProjectsMember
                                            values={state.participants}
                                            maxShow={4}
                                            size={30}
                                            onChange={(members) =>
                                                setState({ participants: members })
                                            }
                                            // disabled
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <MultiSelect
                        dataClickId="tags"
                        data={state.tags.map((val) => {
                            return { value: val, label: val };
                        })}
                        onChange={(data) => setState({ tags: data.map((val) => val.label) })}
                        className={css.create_input}
                        title="Tags"
                        offerHints={tagList.filter(
                            (item) => !Object.values(DiscussionType).includes(item as any)
                        )}
                    />
                    <Button
                        className={css.create_submitBtn}
                        color="green"
                        type="submit"
                        data-analytics-click="save_forum_button"
                    >
                        <span>{edit ? 'Save' : 'Post'}</span>
                    </Button>
                </form>
            </Popup>
            {/* <PopupBox
                active={inviteModal.active}
                onClose={inviteModal.close}
                enableScrollOnActive
                children={
                    <ForumInvite
                        members={state.participants}
                        onMemberChange={(participants) => setState({ participants })}
                        onSubmit={inviteModal.close}
                        onClose={inviteModal.close}
                    />
                }
            /> */}
        </>
    );
};
