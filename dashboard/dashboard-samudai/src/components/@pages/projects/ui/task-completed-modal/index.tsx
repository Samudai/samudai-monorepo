import React from 'react';
import { useObjectState } from 'hooks/use-object-state';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import Button from 'ui/@buttons/Button/Button';
import TextArea from 'ui/@form/TextArea/TextArea';
import { Stars } from 'ui/stars';
import css from './task-completed-modal.module.scss';

interface Props {}

export const TaskCompletedModal: React.FC<Props> = () => {
    const [progress, setProgress] = useObjectState({
        payment: false,
        rate: false,
    });

    const [formData, setFormData] = useObjectState({
        rating: 0,
        review: '',
    });

    const handleFormSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
        ev.preventDefault();

        setProgress({ rate: true });
    };

    return (
        <Popup className={css.root} onClose={() => {}}>
            <PopupTitle
                title={
                    <>
                        <strong>Task</strong> Completed
                    </>
                }
                icon="/img/icons/handshake.png"
            />

            <div className={css.wrapper}>
                {!progress.rate && (
                    <div className={css.item}>
                        <h3 className={css.title}>Rate {'{Contributor’s Name}'} for the tasks</h3>

                        <form className={css.form} onSubmit={handleFormSubmit}>
                            <div className={css.rating}>
                                <p className={css.rating_value}>{formData.rating.toFixed(1)}</p>

                                <Stars
                                    className={css.rating_stars}
                                    size={13}
                                    rate={formData.rating}
                                    onChange={(rating) => setFormData({ rating })}
                                />
                            </div>

                            <h3 className={css.title} data-margin={16}>
                                Your Review
                            </h3>

                            <TextArea
                                className={css.textarea}
                                value={formData.review}
                                onChange={(ev) => setFormData({ review: ev.target.value })}
                                placeholder="Tap to start typing"
                            />

                            <div className={css.footer}>
                                <p className={css.footer_text}>
                                    We at Samudai believe that ratings maintain the quality of work
                                    through out. Rate Now
                                </p>

                                <Button
                                    className={css.footer_btn}
                                    disabled={
                                        formData.rating === 0 && formData.review.trim() === ''
                                    }
                                    type="submit"
                                    color="green"
                                >
                                    <span>Rate Now</span>
                                </Button>
                            </div>
                        </form>
                    </div>
                )}

                {!progress.payment && (
                    <div className={css.item}>
                        <h3 className={css.title}>Initiate payment for the tasks</h3>

                        <ul className={css.tokens}>
                            <li className={css.tokens_item}>
                                <img src="/img/temp/token-1.png" alt="" />

                                <span>Gnosis Safe</span>
                            </li>
                            <li className={css.tokens_item}>
                                <img src="/img/temp/token-2.png" alt="" />

                                <span>ETH 1</span>
                            </li>
                            <li className={css.tokens_item}>
                                <img src="/img/temp/token-3.png" alt="" />

                                <span>USDT 200</span>
                            </li>
                        </ul>

                        <div className={css.footer}>
                            <p className={css.footer_text}>
                                You will have to initiate the transaction on your wallet.
                            </p>

                            <Button className={css.footer_btn} color="green">
                                <span>Make Payment</span>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </Popup>
    );
};
