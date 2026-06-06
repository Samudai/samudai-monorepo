import React, { useMemo, useState } from 'react';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import Button from 'ui/@buttons/Button/Button';
import Input from 'ui/@form/Input/Input';
import css from './popup.module.scss';
import { useUpdateEmailMutation } from 'store/services/userProfile/userProfile';
import { getMemberId } from 'utils/utils';
import { toast } from 'utils/toast';

interface EmailPopupProps {
    onClose: () => void;
    callback: () => void;
}

const EmailPopup: React.FC<EmailPopupProps> = ({ onClose, callback }) => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    const [updateEmail] = useUpdateEmailMutation();

    const handleSubmit = async () => {
        setIsLoading(true);
        await updateEmail({
            memberId: getMemberId(),
            email: email,
        })
            .then(() => {
                toast('Success', 5000, 'Email updated successfully.', '');
                onClose();
                callback();
            })
            .catch((err) => {
                toast('Failure', 5000, 'Failed to update Email', '');
                console.log(err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const inputError = useMemo(() => {
        if (email && !regex.test(email)) {
            return 'Please enter a valid email address';
        } else return '';
    }, [email]);

    return (
        <>
            {
                <Popup className={css.root}>
                    <PopupTitle icon="/img/icons/party.png" title={'Enter E-Mail'} />

                    <div className={css.description}>
                        Your e-mail will help us keep you posted with latest jobs and activities,
                    </div>

                    <Input
                        className={css.input}
                        title="E-Mail"
                        placeholder="yourname@yourmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={inputError}
                    />

                    <Button
                        className={css.button}
                        color="gradient"
                        onClick={handleSubmit}
                        disabled={!email || inputError != '' || isLoading}
                    >
                        <span>Submit</span>
                    </Button>
                </Popup>
            }
        </>
    );
};

export default EmailPopup;
