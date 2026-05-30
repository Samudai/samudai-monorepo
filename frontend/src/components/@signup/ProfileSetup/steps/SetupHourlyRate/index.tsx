import React, { useState } from 'react';
import { updateHourlyRate } from 'store/services/userProfile/model';
import {
    useUpdateContributorProgressMutation,
    useUpdateHourlyRateMutation,
} from 'store/services/userProfile/userProfile';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupSubtitle from 'components/@popups/components/PopupSubtitle/PopupSubtitle';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import Button from 'ui/@buttons/Button/Button';
import TextArea from 'ui/@form/TextArea/TextArea';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import styles from './SetupHourlyRate.module.scss';
import { ActivityEnums } from '@samudai_xyz/gateway-consumer-types';
import { useTypedSelector, useTypedDispatch } from 'hooks/useStore';
import { selectContributorProgress, changeContributorProgress } from 'store/features/common/slice';

interface SetupHourlyRateProps {
    type: 'add' | 'update';
    amount?: number;
    currency?: string;
    onClose?: () => void;
    callback?: (amount: string, currency: string) => void;
}

const SetupHourlyRate: React.FC<SetupHourlyRateProps> = ({
    type,
    amount: currAmount,
    currency: currCurrency,
    onClose,
    callback,
}) => {
    const [amount, setAmount] = useState(currAmount);
    const [currency, setCurrency] = useState(currCurrency || 'USDT');

    const memberId = getMemberId();
    const currContributorProgress = useTypedSelector(selectContributorProgress);
    const dispatch = useTypedDispatch();

    const [updateContributorProgress] = useUpdateContributorProgressMutation();
    const [updateHourlyRate] = useUpdateHourlyRateMutation();

    const handleSubmit = async () => {
        if (!amount) {
            toast('Attention', 5000, 'Please add hourly rate', '')();
        }

        const payload: updateHourlyRate = {
            member_id: memberId,
            hourly_rate: String(amount),
            currency,
        };

        await updateHourlyRate(payload)
            .then(() => {
                toast('Success', 5000, 'Hourly rate successfully updated', '')();
                callback?.(String(amount), currency);
                onClose?.();
                if (!currContributorProgress.add_hourly_rate)
                    updateContributorProgress({
                        memberId: getMemberId(),
                        itemId: [ActivityEnums.NewContributorItems.ADD_HOURLY_RATE],
                    }).then(() => {
                        dispatch(
                            changeContributorProgress({
                                contributorProgress: {
                                    ...currContributorProgress,
                                    add_hourly_rate: true,
                                },
                            })
                        );
                    });
            })
            .catch(() => {
                toast('Failure', 5000, 'Failed to update hourly rate', '')();
            });
    };

    return (
        <Popup className={styles.root} onClose={onClose} dataParentId="hourly_rate_modal">
            <PopupTitle
                icon="/img/icons/setup.png"
                title={
                    <>
                        <strong>Add</strong> Hourly Rate
                    </>
                }
            />
            <PopupSubtitle text="Currency" className={styles.rateSubtitle} />
            <TextArea
                placeholder="Type text..."
                className={styles.textarea}
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                disabled
                data-analytics-click="currency_input"
            />
            <PopupSubtitle text="Amount" className={styles.reviewSubtitle} />
            <TextArea
                placeholder="Enter amount..."
                className={styles.textarea}
                value={amount || ''}
                onChange={(e) => {
                    const re = /^\d+(\.\d+)*$/;
                    if (e.target.value === '' || re.test(e.target.value)) {
                        setAmount(+e.target.value);
                    }
                    // if (!isNaN(+e.target.value)) {
                    //   setAmount(+e.target.value)
                    // }
                }}
                data-analytics-click="amount_input"
            />
            <Button
                color="green"
                className={styles.postBtn}
                disabled={!amount}
                onClick={handleSubmit}
                data-analytics-click={type + '_button'}
            >
                <span>{type === 'add' ? 'Add' : 'Update'}</span>
            </Button>
        </Popup>
    );
};

export default SetupHourlyRate;
