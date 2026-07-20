import React from 'react';
import { IQuestion } from './utils/getDefaultCreateData';
import Input from 'ui/@form/Input/Input';
import styles from './styles/JobQuestion.module.scss';
import CloseButton from 'ui/@buttons/Close/Close';

interface JobQuestionProps {
    data: IQuestion;
    index: number;
    onChange: (data: IQuestion) => void;
    onRemove: () => void;
}

const JobQuestion: React.FC<JobQuestionProps> = ({ data, index, onChange, onRemove }) => {
    return (
        <div className={styles.question}>
            <div className={styles.question_head}>
                <h3 className={styles.question_title}>Question {index}</h3>
                <CloseButton className={styles.question_removeBtn} onClick={onRemove} />
            </div>
            <Input
                className={styles.question_input}
                value={data.question}
                onChange={(e) => onChange({ ...data, question: e.target.value })}
                placeholder="Type question"
            />
        </div>
    );
};

export default JobQuestion;
