import React, { useState } from 'react';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import styles from './CancelSubscriptionModal.module.scss';
import Select from 'ui/@form/Select/Select';
import Input from 'ui/@form/Input/Input1';
import { toast } from 'utils/toast';

interface CancelSubscriptionProps {
    onClose?: () => void;
    onSubmit: (feedback: string, alternative?: string) => Promise<void>;
}

const feedbackOptions = [
    `Didn't like it`,
    'Too Expensive',
    'Switching to an alternative',
    'Other (Reason text)',
];

export const CancelSubscription: React.FC<CancelSubscriptionProps> = ({ onClose, onSubmit }) => {
    const [selectedFeedback, setSelectedFeedback] = useState<string | undefined>();
    const [newFeedback, setNewFeedback] = useState<string | undefined>();
    const [btnLoading, setBtnLoading] = useState(false);

    const handleSubmit = () => {
        if (!selectedFeedback) {
            return toast('Attention', 5000, 'Please select an option', '')();
        }

        setBtnLoading(true);
        onSubmit(selectedFeedback, newFeedback).finally(() => setBtnLoading(false));
    };

    return (
        <Popup className={styles.root} onClose={onClose} dataParentId="add_participants_modal">
            <PopupTitle icon={'/img/icons/survey-smile.png'} title={<>It's sad to see you go!</>} />
            <p className={styles.text}>
                Don't leave us haning. <br />
                Please let us know.
            </p>
            <Select className={styles.select} closeClickOuside closeClickItem>
                <Select.Button className={styles.select_button} arrow>
                    {selectedFeedback || 'Select an Option'}
                </Select.Button>

                <Select.List className={styles.select_list}>
                    {feedbackOptions.map((option) => (
                        <Select.Item
                            key={option}
                            className={styles.select_item}
                            onClick={() => setSelectedFeedback(option)}
                            data-analytics-click={option}
                        >
                            {option}
                        </Select.Item>
                    ))}
                </Select.List>
            </Select>

            {selectedFeedback === feedbackOptions[3] && (
                <div style={{ marginTop: '20px' }}>
                    <Input
                        value={newFeedback}
                        onChange={(e) => setNewFeedback(e.target.value)}
                        placeholder="Other Reason"
                    />
                </div>
            )}

            {selectedFeedback === feedbackOptions[2] && (
                <div style={{ marginTop: '20px' }}>
                    <Input
                        value={newFeedback}
                        onChange={(e) => setNewFeedback(e.target.value)}
                        placeholder="Mention the alternative, if you don't mind?"
                    />
                </div>
            )}

            <div className={styles.controls}>
                <button
                    className={styles.controls_backBtn}
                    onClick={() =>
                        window.open('https://calendly.com/kushagra_agarwal/talk-to-us', '_blank')
                    }
                    data-analytics-click="back_button"
                >
                    <span>Get on a Call</span>
                </button>

                <button
                    className={styles.controls_submitBtn}
                    onClick={handleSubmit}
                    data-analytics-click="submit_button"
                    disabled={btnLoading}
                >
                    <span>Submit</span>
                </button>
            </div>
        </Popup>
    );
};
