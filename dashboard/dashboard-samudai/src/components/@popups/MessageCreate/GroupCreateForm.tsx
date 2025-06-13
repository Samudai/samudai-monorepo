import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import PopupSubtitle from '../components/PopupSubtitle/PopupSubtitle';
import { yupResolver } from '@hookform/resolvers/yup';
import { ChatCreateGroupType } from '@pushprotocol/restapi/src/lib/chat';
import clsx from 'clsx';
import * as Yup from 'yup';
import { selectChatKey } from 'store/features/chats/slice';
import { selectAccount } from 'store/features/common/slice';
import { currActiveChat, mode, setReloadChats } from 'store/features/messages/slice';
import { Mode } from 'store/features/messages/state';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import { createGroup } from 'components/@pages/messages/chatUtils';
import Button from 'ui/@buttons/Button/Button';
import CloseButton from 'ui/@buttons/Close/Close';
import Input from 'ui/@form/Input/Input';
import Radio from 'ui/@form/Radio/Radio';
import TextArea from 'ui/@form/TextArea/TextArea';
import PlusIcon from 'ui/SVG/PlusIcon';
import Switch from 'ui/Switch/Switch';
import { toast } from 'utils/toast';
import SearchMember from './SearchMember';
import styles from './MessageCreate.module.scss';

enum GroupTypeEnum {
    PUBLIC = 'Public',
    PRIVATE = 'Private',
}

interface GroupCreateFormProps {
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

const defaultImage =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAvklEQVR4AcXBsW2FMBiF0Y8r3GQb6jeBxRauYRpo4yGQkMd4A7kg7Z/GUfSKe8703fKDkTATZsJsrr0RlZSJ9r4RLayMvLmJjnQS1d6IhJkwE2bT13U/DBzp5BN73xgRZsJMmM1HOolqb/yWiWpvjJSUiRZWopIykTATZsJs5g+1N6KSMiO1N/5DmAkzYTa9Lh6MhJkwE2ZzSZlo7xvRwson3txERzqJhJkwE2bT6+JhoKTMJ2pvjAgzYSbMfgDlXixqjH6gRgAAAABJRU5ErkJggg==';

const GroupCreateForm: React.FC<GroupCreateFormProps> = ({ onClose }) => {
    const [groupType, setGroupType] = useState<GroupTypeEnum>(GroupTypeEnum.PUBLIC);
    const [wallets, setWallets] = useState<Array<{ wallet: string; isAdmin: boolean }>>([]);
    const [defaultValues, setDefaultValues] = useState<ChatCreateGroupType>();

    const chatKey = useTypedSelector(selectChatKey);
    const account = useTypedSelector(selectAccount);
    const currMode = useTypedSelector(mode);
    const activeChat = useTypedSelector(currActiveChat);
    const dispatch = useTypedDispatch();

    useEffect(() => {
        if (currMode === Mode.EDIT && activeChat?.groupInformation) {
            const data = activeChat.groupInformation;
            setDefaultValues({
                groupName: data.groupName,
                groupDescription: data.groupDescription || '',
                members: data.members.map((member) => member.wallet.slice(7)),
                groupImage: data.groupImage || '',
                admins: data.members
                    .filter((member) => member.isAdmin)
                    .map((member) => member.wallet.slice(7)),
                isPublic: data.isPublic,
            });
            setWallets(data.members);
        }
    }, [currMode, activeChat]);

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

    const onSubmit = (data: ChatCreateGroupType) => {
        createGroup({
            ...data,
            account: account || undefined,
            pgpPrivateKey: chatKey,
            groupImage: defaultImage,
        }).then(() => {
            const message =
                currMode === Mode.EDIT
                    ? 'Group updated successfully'
                    : 'Group created successfully';
            toast('Success', 5000, message, '')();
            dispatch(setReloadChats(true));
            onClose?.();
        });
    };

    const description = watch('groupDescription');

    console.log(errors);

    const handleChange = (value: string, index: number) => {
        setWallets((wallets) => {
            const newWallets = [...wallets];
            newWallets[index].wallet = value;
            return newWallets;
        });
    };

    useEffect(() => {
        defaultValues && reset(defaultValues);
    }, [defaultValues]);

    useEffect(() => {
        setValue('isPublic', groupType === GroupTypeEnum.PUBLIC);
    }, [groupType]);

    useEffect(() => {
        const newWallets = wallets.filter((wallet) => wallet.wallet);
        const newAdmins = newWallets.filter((wallet) => wallet.isAdmin === true);
        setValue(
            'members',
            newWallets.map((wallet) => wallet.wallet)
        );
        setValue(
            'admins',
            newAdmins.map((wallet) => wallet.wallet)
        );
    }, [wallets]);

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
            <>
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
            </>
            <>
                <PopupSubtitle className={styles.subtitle} text="Group Members" />
                {wallets.map((wallet, index) => (
                    <div key={wallet.wallet} className={styles.addWallet}>
                        <SearchMember
                            value={wallets[index].wallet}
                            setValue={(value) => handleChange(value, index)}
                        />
                        <div className={styles.switchContainer}>
                            <PopupSubtitle className={styles.isAdmin} text="Admin" />
                            <Switch
                                className={styles.switch}
                                active={wallets[index].isAdmin}
                                onClick={() =>
                                    setWallets((wallets) => {
                                        const newWallets = [...wallets];
                                        newWallets[index].isAdmin = !newWallets[index].isAdmin;
                                        return newWallets;
                                    })
                                }
                                data-analytics-click="isAdmin_toggle"
                            />
                        </div>
                        <CloseButton
                            className={styles.removeBtn}
                            onClick={() =>
                                setWallets((wallets) => {
                                    const newWallets = [...wallets];
                                    newWallets.splice(index, 1);
                                    return newWallets;
                                })
                            }
                        />
                    </div>
                ))}
                <Button
                    color="green"
                    onClick={() =>
                        setWallets((wallets) => [...wallets, { wallet: '', isAdmin: false }])
                    }
                    className={styles.addBtn}
                    data-analytics-click="add_wallet_button"
                >
                    <PlusIcon />
                    <span>Add Wallet</span>
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

export default GroupCreateForm;
