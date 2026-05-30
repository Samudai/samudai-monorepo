import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PopupSubtitle from '../components/PopupSubtitle/PopupSubtitle';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { currActiveChannel, mode } from 'store/features/messages/slice';
import { Mode } from 'store/features/messages/state';
import { useTypedSelector } from 'hooks/useStore';
import Button from 'ui/@buttons/Button/Button';
import CloseButton from 'ui/@buttons/Close/Close';
import Input from 'ui/@form/Input/Input';
import TextArea from 'ui/@form/TextArea/TextArea';
import PlusIcon from 'ui/SVG/PlusIcon';
import Switch from 'ui/Switch/Switch';
import { toast } from 'utils/toast';
import styles from './MessageCreate.module.scss';
import { useSendBirdChat } from 'components/@pages/messages/useSendBirdChat';
import { Role } from '@sendbird/chat';
import { getMemberId } from 'utils/utils';
import SearchMemberByName from './SearchMemberByName';
import { GroupChannel } from '@sendbird/chat/groupChannel';

enum GroupTypeEnum {
    PUBLIC = 'Public',
    PRIVATE = 'Private',
}

export interface ChatCreateGroupType {
    groupName: string;
    groupDescription: string;
    members: string[];
    groupImage: string;
    admins: string[];
    isPublic: boolean;
}

interface SendBirdGroupFormProps {
    currChannel: GroupChannel | null;
    onClose?: () => void;
}

const validationSchema = Yup.object().shape({
    groupName: Yup.string().required(),
    groupDescription: Yup.string().required(),
    members: Yup.array().of(Yup.string()).required(),
    groupImage: Yup.string(),
    admins: Yup.array().of(Yup.string()).required(),
    isPublic: Yup.boolean().required(),
});

const initialValues: ChatCreateGroupType = {
    groupName: '',
    groupDescription: '',
    members: [],
    groupImage: '',
    admins: [],
    isPublic: true,
};

const SendBirdGroupForm: React.FC<SendBirdGroupFormProps> = ({ currChannel, onClose }) => {
    const [groupType, setGroupType] = useState<GroupTypeEnum>(GroupTypeEnum.PUBLIC);
    const [memberNames, setMemberNames] = useState<string[]>([]);
    const [members, setMembers] = useState<
        Array<{
            memberId: string;
            isAdmin: boolean;
        }>
    >([]);
    const [defaultValues, setDefaultValues] = useState<ChatCreateGroupType>();

    const currMode = useTypedSelector(mode);
    const activeChannel = useTypedSelector(currActiveChannel);
    const currMemberId = getMemberId();

    const { createGroupChannel, updateGroupChannel } = useSendBirdChat(currMemberId!);

    useEffect(() => {
        if (currMode === Mode.EDIT && activeChannel) {
            const fn = async () => {
                const data = await activeChannel.getAllMetaData();
                setDefaultValues({
                    groupName: activeChannel.name || '',
                    groupDescription: data?.description || '',
                    members: activeChannel.members.map((member) => member.userId),
                    groupImage: activeChannel.coverUrl || '',
                    admins: activeChannel.members
                        .filter((member) => member.role === Role.OPERATOR)
                        .map((member) => member.userId),
                    isPublic: activeChannel.isPublic,
                });
                setMembers(
                    activeChannel.members.map((member) => ({
                        memberId: member.userId,
                        isAdmin: member.role === Role.OPERATOR,
                    }))
                );
                setMemberNames(activeChannel.members.map((member) => member.nickname));
            };
            fn();
        }
    }, [currMode, activeChannel]);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ChatCreateGroupType>({
        mode: 'all',
        defaultValues: initialValues,
        //@ts-ignore
        resolver: yupResolver(validationSchema),
    });

    const onSubmit = async (data: ChatCreateGroupType) => {
        if (currMode === Mode.EDIT && currChannel) {
            if (
                !(
                    currChannel.members.find((m) => m.userId === currMemberId)?.role ===
                    Role.OPERATOR
                )
            ) {
                return toast(
                    'Attention',
                    5000,
                    'Only Admins have access to update Group info',
                    ''
                )();
            }
            try {
                await updateGroupChannel(data, currChannel);
                toast('Success', 5000, 'Group updated successfully', '')();
                onClose?.();
            } catch (err) {
                toast('Failure', 5000, 'Something went wrong!', '')();
                console.log(err);
            }
        } else {
            try {
                await createGroupChannel(data);
                toast('Success', 5000, 'Group created successfully', '')();
                onClose?.();
            } catch (err) {
                toast('Failure', 5000, 'Something went wrong!', '')();
                console.log(err);
            }
        }
    };

    const description = watch('groupDescription');

    const handleChange = (value: string, index: number) => {
        setMembers((members) => {
            const newMembers = [...members];
            newMembers[index].memberId = value;
            return newMembers;
        });
    };

    const handleNameChange = (value: string, index: number) => {
        setMemberNames((members) => {
            const newMemberNames = [...members];
            newMemberNames[index] = value;
            return newMemberNames;
        });
    };

    useEffect(() => {
        defaultValues && reset(defaultValues);
    }, [defaultValues]);

    useEffect(() => {
        setValue('isPublic', groupType === GroupTypeEnum.PUBLIC);
    }, [groupType]);

    useEffect(() => {
        const newMembers = members.filter((member) => member.memberId);
        const newAdmins = newMembers.filter((member) => member.isAdmin === true);
        setValue(
            'members',
            newMembers.map((member) => member.memberId)
        );
        setValue(
            'admins',
            newAdmins.map((member) => member.memberId)
        );
    }, [members]);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Input
                className={styles.inputTitle}
                placeholder="Group Name"
                {...register('groupName')}
                data-analytics-click="group_name_input"
            />
            <>
                <PopupSubtitle className={styles.subtitle} text="Group Description" />
                <TextArea
                    value={description}
                    placeholder="Enter description."
                    className={styles.textArea}
                    onChange={(e) => setValue('groupDescription', e.target.value)}
                    data-analytics-click="group_description_input"
                />
            </>
            {/* <>
                <PopupSubtitle className={styles.subtitle} text="Group Type" />
                <ul className={styles.type}>
                    {Object.values(GroupTypeEnum).map((type) => (
                        <li
                            className={clsx(
                                styles.typeItem,
                                type === groupType && styles.typeItemActive
                            )}
                            onClick={() => setGroupType(type)}
                            key={type}
                            data-analytics-click={'group_type_' + type}
                        >
                            <Radio checked={type === groupType} className={styles.typeRadio} />
                            <p className={styles.typeName}>{type}</p>
                        </li>
                    ))}
                </ul>
            </> */}
            <>
                <PopupSubtitle className={styles.subtitle} text="Group Members" />
                {members.map((member, index) => (
                    <div key={member.memberId} className={styles.addWallet}>
                        <SearchMemberByName
                            value={memberNames[index]}
                            setValue={(value) => handleNameChange(value, index)}
                            setMemberId={(value) => handleChange(value, index)}
                        />
                        <div className={styles.switchContainer}>
                            <PopupSubtitle className={styles.isAdmin} text="Admin" />
                            <Switch
                                className={styles.switch}
                                active={members[index].isAdmin}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setMembers((members) => {
                                        const newMembers = [...members];
                                        newMembers[index].isAdmin = !newMembers[index].isAdmin;
                                        return newMembers;
                                    });
                                }}
                                data-analytics-click="isAdmin_toggle"
                            />
                        </div>
                        <CloseButton
                            className={styles.removeBtn}
                            onClick={() =>
                                setMembers((members) => {
                                    const newMembers = [...members];
                                    newMembers.splice(index, 1);
                                    return newMembers;
                                })
                            }
                        />
                    </div>
                ))}
                <Button
                    color="green"
                    onClick={() =>
                        setMembers((members) => [
                            ...members,
                            { memberId: '', isAdmin: false, memberName: '' },
                        ])
                    }
                    className={styles.addBtn}
                    data-analytics-click="add_wallet_button"
                >
                    <PlusIcon />
                    <span>Add Member</span>
                </Button>
            </>
            <Button
                color="orange"
                className={styles.submit}
                type="submit"
                data-analytics-click="create_group_button"
            >
                <span>{currMode === Mode.EDIT ? 'Update Group' : 'Create Group'}</span>
            </Button>
        </form>
    );
};

export default SendBirdGroupForm;
