import clsx from 'clsx';
import React from 'react';
import MarkIcon from 'ui/SVG/MarkIcon';
import css from './project-progress.module.scss';

interface ProjectProgressProps {
    className?: string;
    done: number;
    total: number;
}

const ProjectProgress: React.FC<ProjectProgressProps> = ({ className, done, total }) => {
    return (
        <div
            className={clsx(
                className,
                css.progress,
                done === total && total !== 0 && css.progressDone
            )}
        >
            <div className={css.progress_icon}>
                <MarkIcon />
            </div>
            <p className={css.progress_value}>
                <span className={css.progress_value_done}>{done}</span>
                <span className={css.progress_value_total}>/{total}</span>
            </p>
        </div>
    );
};

export default ProjectProgress;
