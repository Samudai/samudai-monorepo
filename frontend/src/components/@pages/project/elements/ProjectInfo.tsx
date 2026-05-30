import { ProjectResponse } from '@samudai_xyz/gateway-consumer-types/dist/types';
import usePopup from 'hooks/usePopup';
import ProjectInvite from 'components/@popups/ProjectInvite/ProjectInvite';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import styles from '../styles/ProjectInfo.module.scss';

interface ProjectInfoProps {
    project: ProjectResponse;
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({ project }) => {
    const projectInvite = usePopup();
    // const contributors = ProjectHelper.getContributorsAll(project);
    // const { progress, hours, status } = ProjectHelper.getStatistics(project);

    return (
        <ul className={styles.root}>
            {/* <li className={styles.cards}>
        <div className={styles.card}>
          <div className={styles.cardInner}>
            <ChartIcons.FavoriteChart
              className={clsx(styles.cardIcon, styles.cardIconProgress)}
            />
            <p className={styles.cardValue}>{project?.tasks?.length - status.Done}</p>
            <p className={styles.cardName}>In Progress Tasks</p>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardInner}>
            <CopySuccess className={clsx(styles.cardIcon, styles.cardIconComplete)} />
            <p className={styles.cardValue}>{status.Done}</p>
            <p className={styles.cardName}>Completed Tasks</p>
          </div>
        </div>
      </li>
      <li className={styles.info}>
        <div className={styles.infoInner}>
          <p className={styles.infoTitle}>Team Members</p>
          <Members users={contributors.map((c) => c.avatar)} className={styles.members} />
          <p className={styles.infoTitle}>Progect Progress</p>
          <Progress percent={progress} className={styles.progress} />
        </div>
      </li>
      <li className={styles.invite}>
        <Button color="orange" className={styles.addBtn} onClick={projectInvite.open}>
          <PlusIcon />
          <span>Invite</span>
        </Button>
        <p className={styles.infoTitle}>Team Members</p>
        <p className={styles.hours}>{hours} H</p>
      </li> */}
            <PopupBox active={projectInvite.active} onClose={projectInvite.close}>
                <ProjectInvite />
            </PopupBox>
        </ul>
    );
};

export default ProjectInfo;
