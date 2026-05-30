import React from 'react';
import Button from 'ui/@buttons/Button/Button';
import css from './es-applicants.module.scss';

interface EsApplicantsProps {
    text: string | React.ReactNode;
}

export const EsApplicants: React.FC<EsApplicantsProps> = ({ text }) => {
    return (
        <div className={css.empty}>
            <img className={css.empty_img} src="/img/account.svg" alt="account" />

            <p className={css.empty_text}>{text}</p>

            <Button className={css.empty_postBtn} color="orange-outlined">
                <span>Post a Job</span>
            </Button>
        </div>
    );
};
