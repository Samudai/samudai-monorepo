import styles from './styles/JobHead.module.scss';
import Button from 'ui/@buttons/Button/Button';
import PlusIcon from 'ui/SVG/PlusIcon';
import { useNavigate } from 'react-router-dom';

interface JobHeadProps {
    createPost?: () => void;
}

const JobHead: React.FC<JobHeadProps> = ({ createPost }) => {
    const navigate = useNavigate();
    return (
        <div className={styles.head}>
            {/* <TabNavigation className={styles.tab}>
        {tabs.map((tab) => (
          <TabNavigation.Button
            active={tabActive === tab}
            onClick={() => changeTab(tab)}
            key={tab}
          >
            {tab}
          </TabNavigation.Button>
        ))}
      </TabNavigation> */}
            <div className={styles.headControls}>
                <Button
                    color="green"
                    className={styles.headViewBtn}
                    onClick={() => navigate('/applicants')}
                >
                    <span>View Applicants</span>
                </Button>
                <Button color="orange" className={styles.headPostBtn} onClick={createPost}>
                    <PlusIcon />
                    <span>Post New</span>
                </Button>
            </div>
        </div>
    );
};

export default JobHead;
