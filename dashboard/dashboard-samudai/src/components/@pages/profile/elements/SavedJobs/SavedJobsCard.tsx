import { useState } from 'react';
import clsx from 'clsx';
import ArchiveIcon from 'ui/SVG/ArchiveIcon';
import { TempJobData } from './temp_data';

const SavedJobsCard: React.FC<TempJobData & { className?: string }> = ({
    bounty,
    experience,
    id,
    name,
    skills,
    type,
    className,
}) => {
    const [maxSkills, setMaxSkills] = useState<number>(2);

    const onClickMore = () => {
        setMaxSkills(skills.length);
    };

    return (
        <div className={clsx('saved-job-card', className)}>
            <div className="saved-job-card__content">
                <div className="saved-job-card__header">
                    <h3 className="saved-job-card__name">{name}</h3>
                    <ArchiveIcon className="saved-job-card__icon" />
                </div>
                <div className="saved-job-card__skills">
                    <div className="saved-job-card__skills-list">
                        {/* {skills.slice(0, maxSkills).map((skill) => (
              <UserSkill key={skill.id} skill={skill} />
            ))} */}
                        {skills.length > maxSkills && (
                            <button className="saved-job-card__skills-more" onClick={onClickMore}>
                                <span>+{skills.length - maxSkills}</span>
                            </button>
                        )}
                    </div>
                </div>
                <button className="saved-job-card__link">
                    Open to <span>DAO Members</span>
                </button>
            </div>
        </div>
    );
};

export default SavedJobsCard;
