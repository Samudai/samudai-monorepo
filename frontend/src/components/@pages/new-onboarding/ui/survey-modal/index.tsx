import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubmitFeedbackMutation } from 'store/services/Login/login';
import { submitFeedbackReq } from 'store/services/Login/model';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import Input from 'ui/@form/Input/Input1';
import Select from 'ui/@form/Select/Select';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import css from './survey-modal.module.scss';

interface SurveyModalProps {
    type: 'admin' | 'contributor';
    onClose?: () => void;
    callback?: () => void;
}

const feedbackOptions = [
    'Too confusing for me',
    'I have better alternative',
    'Didn’t get enough time to explore',
    'Other (Reason text)',
];

export const SurveyModal: React.FC<SurveyModalProps> = ({ type, onClose, callback }) => {
    const [selectedFeedback, setSelectedFeedback] = useState<string>('');
    const [newFeedback, setNewFeedback] = useState<string>('');

    const [submitFeedback] = useSubmitFeedbackMutation();
    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!selectedFeedback) {
            return toast('Attention', 5000, 'Select a reason', '')();
        }
        const payload: submitFeedbackReq = {
            feedback: {
                member_id: getMemberId(),
                type_of_member: type,
                feedback: selectedFeedback === feedbackOptions[3] ? newFeedback : selectedFeedback,
            },
        };
        await submitFeedback(payload)
            .unwrap()
            .then((res) => {
                toast('Success', 5000, 'Feedback submitted!', '')();
                navigate('/login');
                callback?.();
                onClose?.();
            })
            .catch((err) => {
                toast('Failure', 5000, 'Failed to submit feedback', '')();
                console.log(err);
            });
    };

    return (
        <Popup className={css.root} dataParentId="survey_modal">
            <div className={css.wrapper}>
                <PopupTitle icon="/img/icons/survey-smile.png" title="It’s sad to see you go!" />

                <p className={css.text}>Don’t leave us hanging. Please let us know 😳</p>

                <Select className={css.select} closeClickOuside closeClickItem>
                    <Select.Button className={css.select_button} arrow>
                        {selectedFeedback || 'Select an Option'}
                    </Select.Button>

                    <Select.List className={css.select_list}>
                        {feedbackOptions.map((option) => (
                            <Select.Item
                                key={option}
                                className={css.select_item}
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

                <div className={css.controls}>
                    <button
                        className={css.controls_backBtn}
                        onClick={onClose}
                        data-analytics-click="back_button"
                    >
                        <span>Go back</span>
                    </button>

                    <button
                        className={css.controls_submitBtn}
                        onClick={handleSubmit}
                        data-analytics-click="submit_button"
                    >
                        <span>Submit</span>
                    </button>
                </div>
            </div>
        </Popup>
    );
};
