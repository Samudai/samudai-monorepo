import React from 'react';
import clsx from 'clsx';
import { TempJobData } from 'components/@pages/profile/elements/SavedJobs/temp_data';
import ArchiveIcon from 'ui/SVG/ArchiveIcon';
import LocationIcon from 'ui/SVG/LocationIcon';
import { beautifySum } from 'utils/format';
import './JobItem.scss';

type JobItemProps = TempJobData & {
    className?: string;
    saved?: boolean;
    component?: keyof JSX.IntrinsicElements;
};

const JobItem: React.FC<JobItemProps> = ({
    className,
    name,
    skills,
    bounty,
    experience,
    type,
    saved,
    component = 'li',
}) => {
    const Component = component;

    return (
        <Component className={clsx('job-item', className)}>
            <header className="job-item__header">
                <h3 className="job-item__header-title">{name}</h3>
                <button className={clsx('job-item__header-save', { saved })}>
                    <ArchiveIcon />
                </button>
            </header>
            {/* <div className="job-item__stack">
        <ul className="job-item__stack-list">
          {skills.map((skill) => (
            <UserSkill className="job-item__stack-item" key={skill.id} skill={skill} />
          ))}
        </ul>
      </div> */}
            <ul className="job-item__info">
                <li className="job-item__info-item">
                    <span className="job-item__info-name">Experience</span>
                    <span className="job-item__info-value">{experience} Years</span>
                </li>
                <li className="job-item__info-item">
                    <span className="job-item__info-name">Bounty</span>
                    <span className="job-item__info-value">
                        <span>$</span>
                        {beautifySum(bounty)}
                    </span>
                </li>
                <li className="job-item__info-item job-item__info-item_location">
                    <LocationIcon className="job-item__info-icon" />
                    <span className="job-item__info-value">{type}</span>
                </li>
            </ul>
        </Component>
    );
};

export default JobItem;
