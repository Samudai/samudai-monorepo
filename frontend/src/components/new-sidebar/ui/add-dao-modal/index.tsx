import Button from 'ui/@buttons/Button/Button';
import Input from 'ui/@form/Input/Input1';
import css from './add-dao-modal.module.scss';
import { useState } from 'react';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import DaoTypeSelect from 'pages/onboarding/pages/page5/DaoTypeSelect';
import { useGetDaoTagsQuery } from 'store/services/Discovery/Discovery';
import { toast } from 'utils/toast';
import { useAddDaoForMemberMutation } from 'store/services/userProfile/userProfile';
import { getMemberId } from 'utils/utils';
import { useLazyGetDaoQuery } from 'store/services/Dao/dao';
import { changeAddedDao } from 'store/features/common/slice';
import { useDispatch } from 'react-redux';

interface AddDaoProps {
    onClose: () => void;
}

const AddDao: React.FC<AddDaoProps> = ({ onClose }) => {
    const [daoName, setDaoName] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [btnLoading, setBtnLoading] = useState(false);
    const memberId = getMemberId();

    const member_type = localStorage.getItem('account_type');
    const [addDao] = useAddDaoForMemberMutation();
    const [getDao] = useLazyGetDaoQuery();
    const dispatch = useDispatch();

    const { data: allTags } = useGetDaoTagsQuery();

    const handleAddTag = (tag: string) => {
        setTags((tags) => [...tags, tag]);
    };

    const handleRemoveTag = (tag: string) => {
        setTags((tags) => tags.filter((t) => t !== tag));
    };

    const handleClick = async () => {
        setBtnLoading(true);
        if (member_type === 'admin' && !daoName)
            return toast('Attention', 5000, 'Please enter your DAO name.', '');
        if (member_type === 'admin' && !tags.length)
            return toast('Attention', 5000, 'Please select atlease one dao type.', '');

        addDao({ memberId: memberId, value: { dao_name: daoName, tags: tags } })
            .then((res) => {
                toast('Success', 5000, 'DAO Added', 'Successfully added Dao.')();
                dispatch(changeAddedDao({ addedDao: true }));
                onClose?.();
                setBtnLoading(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <Popup className={css.root} onClose={onClose} dataParentId="new_project_modal">
            <PopupTitle
                icon="/img/icons/line-star.png"
                className={css.mainTitle}
                title={
                    <>
                        Create <strong>New</strong> DAO
                    </>
                }
            />

            <ul className={css.input}>
                <li className={css.input_item}>
                    <div className={css.input_title}>What’s your DAO Name?</div>
                    <Input
                        placeholder="DAO Name"
                        value={daoName}
                        onChange={(e) => setDaoName(e.target.value)}
                    />
                </li>
                <li className={css.input_item}>
                    <div className={css.input_title}>What type of DAO?</div>
                    <DaoTypeSelect
                        skills={tags}
                        hints={allTags?.data?.tags || []}
                        onAddSkill={handleAddTag}
                        onRemoveSkill={handleRemoveTag}
                        placeholder="Investment, Service, NFT, Research"
                        height="100%"
                        font='400 14px/1.25 "Lato", sans-serif'
                    />
                </li>
            </ul>

            <Button
                color="orange"
                className={css.submit}
                onClick={handleClick}
                isLoading={btnLoading}
                data-analytics-click="create_project_button"
            >
                <span>Create DAO</span>
            </Button>
        </Popup>
    );
};

export default AddDao;
