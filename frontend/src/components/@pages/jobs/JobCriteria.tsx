import CloseButton from 'ui/@buttons/Close/Close';
import styles from './styles/JobCriteria.module.scss';

interface JobCriteriaProps {
    name: string;
    onClick: () => void;
}

const JobCriteria: React.FC<JobCriteriaProps> = ({ name, onClick }) => {
    return (
        <div className={styles.root}>
            <p className={styles.name}>{name}</p>
            <CloseButton className={styles.removeBtn} onClick={onClick} />
        </div>
    );
};

export default JobCriteria;
