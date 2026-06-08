import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import Button from 'ui/@buttons/Button/Button';
import Input from 'ui/@form/Input/Input';
import Magnifier from 'ui/SVG/Magnifier';
import css from './DaoSelect.module.scss';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import { selectDaoList, selectMemberEmail } from 'store/features/common/slice';
import { DAOType } from 'root/mockup/daos';
import { useScrollbar } from 'hooks/useScrollbar';
import { getInitial, getMemberId } from 'utils/utils';
import Radio from 'ui/@form/Radio/Radio';
import {
    useLazyGetManageSubscriptionQuery,
    useGetFirstTimeCheckoutMutation,
} from 'store/services/Billing/billing';
import { useLazyGetDaoByDaoIdQuery } from 'store/services/Dao/dao';
import { toast } from 'utils/toast';
import { addBillingUrl, updateCurrBillingDao } from 'store/features/billing/billingSlice';
import { useNavigate } from 'react-router-dom';

interface MemberRemoveProps {
    onClose?: () => void;
    billing: 'yearly' | 'monthly';
    priceTier: 'small' | 'medium' | 'enterprise';
}

export const DaoSelect: React.FC<MemberRemoveProps> = ({ onClose, billing, priceTier }) => {
    const [selectedDao, setSelectedDao] = useState<DAOType | null>(null);
    const [currDaoList, setCurrDaoList] = useState<DAOType[]>([]);
    const [searchValue, setSearchValue] = useState<string>('');
    const [btnLoading, setBtnLoading] = useState(false);
    const { ref, isScrollbar } = useScrollbar<HTMLUListElement>();

    const daoList = useTypedSelector(selectDaoList);
    const email = useTypedSelector(selectMemberEmail);
    const dispatch = useTypedDispatch();
    const navigate = useNavigate();

    const [getManageSubscription] = useLazyGetManageSubscriptionQuery();
    const [getFirstTimeCheckout] = useGetFirstTimeCheckoutMutation();
    const [getDaoDetails] = useLazyGetDaoByDaoIdQuery();

    const onChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        setSearchValue(target.value);
        if (target.value === '') {
            setCurrDaoList(daoList);
            return;
        }
        setCurrDaoList(
            daoList.filter((dao) => dao.name.toLowerCase()?.includes(target.value.toLowerCase()))
        );
    };

    const onSelect = (dao: DAOType) => {
        // Integration here
        setSelectedDao(dao);
    };

    const handleNewUser = async (daoid: string) => {
        await getFirstTimeCheckout({
            daoId: daoid,
            memberId: getMemberId(),
            billing,
            customerEmail: email!,
            priceTier,
        })
            .unwrap()
            .then((res) => {
                const url = res.data?.url;
                if (url) {
                    window.open(url, '_blank');
                    onClose?.();
                    navigate(`/${daoid}/dashboard/1`);
                }
            })
            .catch((err) => {
                console.log(err);
                toast('Failure', 5000, 'Something went wrong', '')();
            })
            .finally(() => setBtnLoading(false));
    };

    const handleExistingUser = async (daoid: string) => {
        await getManageSubscription(daoid)
            .unwrap()
            .then((res) => {
                const url = res.data?.url;
                if (url) {
                    window.open(url, '_blank');
                    dispatch(addBillingUrl(url));
                    dispatch(updateCurrBillingDao(daoid!));
                    onClose?.();
                    navigate(`/${daoid}/dashboard/1`);
                }
            })
            .catch((err) => {
                console.log(err);
                toast('Failure', 5000, 'Something went wrong', '')();
            })
            .finally(() => setBtnLoading(false));
    };

    const handleContinue = async () => {
        if (!selectedDao?.id) return;
        setBtnLoading(true);
        await getDaoDetails(selectedDao.id)
            .unwrap()
            .then((res) => {
                if (res.data?.dao.subscription.subscription_status === '') {
                    handleNewUser(selectedDao.id);
                } else {
                    handleExistingUser(selectedDao.id);
                }
            })
            .catch((err) => {
                console.log(err);
                toast('Failure', 5000, 'Something went wrong', '')();
                setBtnLoading(false);
            });
    };

    useEffect(() => {
        if (daoList && daoList.length) {
            setCurrDaoList(daoList);
            setSelectedDao(daoList[0]);
        }
    }, [daoList]);

    return (
        <Popup className={css.invite} onClose={onClose} dataParentId="add_participants_modal">
            <PopupTitle
                icon={'/img/icons/money-bag.png'}
                title="Which community would you want to Upgrade?"
                className={css.invite_title}
            />
            <Input
                className={css.invite_input}
                value={searchValue}
                onChange={onChange}
                icon={<Magnifier className={css.invite_input_icon} />}
                placeholder="Search DAO"
            />
            {!!currDaoList.length && (
                <ul
                    ref={ref}
                    className={clsx(
                        'orange-scrollbar',
                        css.invite_list,
                        isScrollbar && css.invite_listScrollbar
                    )}
                >
                    {currDaoList.map((dao) => (
                        <li className={css.invite_item} key={dao.id}>
                            <button
                                className={css.invite_member}
                                onClick={onSelect.bind(null, dao)}
                            >
                                <div className={css.invite_user}>
                                    {dao?.profilePicture ? (
                                        <img
                                            src={dao.profilePicture}
                                            alt="logo"
                                            className={css.invite_user_picture}
                                        />
                                    ) : (
                                        <span className={css.daos_logo}>
                                            <span>{getInitial(dao.name)}</span>
                                        </span>
                                    )}
                                    <div className={css.invite_user_content}>
                                        <h3 className={css.invite_user_name}>{dao.name}</h3>
                                    </div>
                                </div>

                                <Radio
                                    className={css.invite_checkbox}
                                    checked={dao.id === selectedDao?.id}
                                />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            <Button
                onClick={handleContinue}
                className={css.invite_addBtn}
                color="orange"
                type="button"
                disabled={btnLoading}
            >
                <span>Continue</span>
            </Button>
        </Popup>
    );
};
