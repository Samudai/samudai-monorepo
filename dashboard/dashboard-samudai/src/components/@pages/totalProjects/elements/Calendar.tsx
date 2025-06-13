import { ProjectResponse } from '@samudai_xyz/gateway-consumer-types';
import ProjectCalendar from 'components/ProjectCalendar/ProjectCalendar';
import styles from '../styles/Calendar.module.scss';

interface CalendarProps {
    projects: ProjectResponse[];
}

const Calendar: React.FC<CalendarProps> = ({ projects }) => {
    return (
        <div className={styles.root} data-analytics-parent="project_calendar">
            <h2 className={styles.title}>Projects Calendar</h2>
            <div className={styles.calendar}>
                <ProjectCalendar projects={projects} />
            </div>
        </div>
    );
};

export default Calendar;
