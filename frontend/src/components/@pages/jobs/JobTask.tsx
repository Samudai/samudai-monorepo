import React from 'react';
import { IJobTask } from './utils/getDefaultCreateData';
import CloseButton from 'ui/@buttons/Close/Close';
import Input from 'ui/@form/Input/Input';
import TextArea from 'ui/@form/TextArea/TextArea';
import JobSkills from './JobSkills';
import styles from './styles/JobTask.module.scss';

interface JobTaskProps {
    data: IJobTask;
    onRemove: () => void;
    onChange: (task: IJobTask) => void;
}

const JobTask: React.FC<JobTaskProps> = ({ data, onChange, onRemove }) => {
    return (
        <div className={styles.task}>
            <div className={styles.task_head}>
                <Input
                    title="Title Task"
                    className={styles.task_title}
                    value={data.title}
                    onChange={(e) => onChange({ ...data, title: e.target.value })}
                />
                <CloseButton className={styles.task_remove} onClick={onRemove} />
            </div>
            <h3 className={styles.title}>Description Tasks</h3>
            <TextArea
                className={styles.task_desc}
                value={data.description}
                onChange={(e) => onChange({ ...data, description: e.target.value })}
            />
            <h3 className={styles.title}>Skills Task</h3>
            <JobSkills
                className={styles.task_skills}
                data={data.skills}
                onChange={(skills) => onChange({ ...data, skills })}
            />
        </div>
    );
};

export default JobTask;
