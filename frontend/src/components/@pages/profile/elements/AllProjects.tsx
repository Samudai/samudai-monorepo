import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { selectActiveDao, selectRoles } from 'store/features/common/slice';
import { useGetProjectByMemberIdMutation } from 'store/services/userProfile/userProfile';
import { useTypedDispatch, useTypedSelector } from 'hooks/useStore';
import Block from 'components/Block/Block';
import { ProjectList } from 'components/project';
import { getMemberId } from 'utils/utils';
import styles from '../styles/AllProjects.module.scss';

interface AllProjectsProps {
    showProjects: boolean;
    setShowProjects: () => void;
}

const AllProjects: React.FC<AllProjectsProps> = ({ setShowProjects, showProjects }) => {
    // const { data } = useTypedSelector(selectProjects);
    const { memberid } = useParams();
    const activeDAO = useTypedSelector(selectActiveDao);
    const roles = useTypedSelector(selectRoles);
    const dispatch = useTypedDispatch();
    const localData = localStorage.getItem('signUp');
    const parsedData = !!localData && JSON.parse(localData);
    const member_id = !!parsedData && parsedData.member_id;
    const sameMember = getMemberId() === memberid;
    const payload = {
        member_id: member_id,
        daos: [
            {
                dao_id: activeDAO,
                roles,
            },
        ],
    };
    const [getProjects, { data, isSuccess }] = useGetProjectByMemberIdMutation({
        fixedCacheKey: activeDAO,
    });

    const fetchProjects = async () => {
        getProjects(payload)
            .unwrap()
            .then((res) => {})
            .catch((err) => {
                console.error(err);
            });
    };

    useEffect(() => {
        if (!data) {
            fetchProjects();
        }
        console.log('Dao Changed to', activeDAO);
    }, [activeDAO]);

    return (
        <Block className={styles.root}>
            <Block.Header className={styles.header}>
                <Block.Title className={styles.title}>All Projects</Block.Title>
                <button onClick={setShowProjects} className={styles.showMore}>
                    {showProjects ? 'Show Less' : 'Show More'}
                </button>
            </Block.Header>
            <Block.Scrollable className={styles.content}>
                <ProjectList
                    className={styles.list}
                    projects={data?.data}
                    sameMember
                    contributor
                    borad={true}
                />
            </Block.Scrollable>
        </Block>
    );
};

export default AllProjects;
