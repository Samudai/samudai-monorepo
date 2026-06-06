import React, { useState } from 'react';
import { JobsEnums } from '@samudai_xyz/gateway-consumer-types';
import clsx from 'clsx';
import { useCreateApplicantMutation } from 'store/services/jobs/totalJobs';
import Popup from 'components/@popups/components/Popup/Popup';
import Button from 'ui/@buttons/Button/Button';
import Input from 'ui/@form/Input/Input';
import ArchiveIcon from 'ui/SVG/ArchiveIcon';
import JobsBoardIcon from 'ui/SVG/sidebar/JobsBoardIcon';
import { toast } from 'utils/toast';
import { OpportunityResponse } from 'utils/types/Jobs';
import { getMemberId } from 'utils/utils';
import styles from '../styles/job-apply.module.scss';

interface JobApplyProps {
    data: OpportunityResponse;
    isSaved: boolean;
    onSave: () => void;
    onSubmit: () => void;
}

const JobApply: React.FC<JobApplyProps> = ({ data, isSaved, onSubmit, onSave }) => {
    const [questions, setQuestions] = useState(
        data?.questions?.map((question, index) => ({
            id: index,
            question: question,
            answer: '',
        }))
    );
    const [createApplicant] = useCreateApplicantMutation();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault();
            const fn = async () => {
                const payload: any = {
                    applicant: {
                        applicant_id: '',
                        job_id: data.job_id,
                        member_id: getMemberId(),
                        clan_id: '',
                        answers: questions ? questions : [],
                        status: JobsEnums.ApplicantStatusType.APPLIED,
                        applicant: '',
                    },
                    type: JobsEnums.ApplicantType.MEMBER,
                };
                const res = await createApplicant(payload).unwrap();
                if (res.data.applicant_id) {
                    toast('Success', 5000, 'Success', 'Successfully applied for job')();
                    onSubmit();
                } else {
                    toast(
                        'Failure',
                        5000,
                        'Error while applying for job',
                        'Something went wrong'
                    )();
                    onSubmit();
                }
            };
            fn();
        } catch (error) {
            toast('Failure', 5000, 'Error while applying for job', 'Something went wrong')();
            onSubmit();
        }
    };

    const handleChangeAnswer = (id: number) => {
        return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setQuestions(
                questions?.map((question) =>
                    question.id === id ? { ...question, answer: e.target.value } : question
                )
            );
        };
    };

    return (
        <Popup className={styles.apply}>
            <h3 className={styles.apply_title}>Apply Now</h3>
            <form className={styles.apply_form} onSubmit={handleSubmit}>
                {questions?.map((question) => (
                    <Input
                        title={question.question}
                        className={styles.apply_input}
                        onChange={handleChangeAnswer(question.id)}
                        key={question.id}
                    />
                ))}
                <div className={styles.apply_footer}>
                    <button
                        className={clsx(styles.apply_saveBtn, isSaved && styles.apply_saveBtnSaved)}
                        type="button"
                        onClick={onSave}
                    >
                        <ArchiveIcon />
                        <span>Save for later</span>
                    </button>
                    <Button color="green" className={styles.apply_applyBtn} type="submit">
                        <JobsBoardIcon />
                        <span>Apply</span>
                    </Button>
                </div>
            </form>
        </Popup>
    );
};

export default JobApply;
