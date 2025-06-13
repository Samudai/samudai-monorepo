import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { selectActiveDao, selectRoles } from 'store/features/common/slice';
import { useDeleteTaskMutation } from 'store/services/projects/tasks';
import { useDeleteProjectMutation } from 'store/services/projects/totalProjects';
import { useGetProjectByMemberIdMutation } from 'store/services/userProfile/userProfile';
import { useTypedSelector } from 'hooks/useStore';
import Popup from 'components/@popups/components/Popup/Popup';
import PopupTitle from 'components/@popups/components/PopupTitle/PopupTitle';
import Loader from 'components/Loader/Loader';
import Button from 'ui/@buttons/Button/Button';
import { toast } from 'utils/toast';
import './styles/ClaimSubdomain.scss';

interface IProps {
    onClose: () => void;
    project?: boolean;
    id: string;
    pid?: string;
}
const DeleteTask: React.FC<IProps> = ({ onClose, project, id, pid }) => {
    const [load, setLoad] = useState<boolean>(false);
    const navigate = useNavigate();
    const { daoid } = useParams();
    const roles = useTypedSelector(selectRoles);
    const activeDAO = useTypedSelector(selectActiveDao);
    const [deleteTask] = useDeleteTaskMutation();
    const [deleteProject] = useDeleteProjectMutation();

    const [getProjects] = useGetProjectByMemberIdMutation({
        fixedCacheKey: activeDAO,
    });

    const handleCreateDiscussion = async () => {
        const localData = localStorage.getItem('signUp');
        const parsedData = !!localData && JSON.parse(localData);
        const member_id = !!parsedData && parsedData.member_id;
        const payload = {
            member_id: member_id,
            daos: [
                {
                    dao_id: daoid!,
                    roles,
                },
            ],
        };

        try {
            if (project) {
                await deleteProject(id).unwrap();
                getProjects(payload);
                navigate(`/${daoid}/projects`);
                onClose();
            } else {
                await deleteTask(id).unwrap();
                navigate(`/${daoid}/projects`);
                onClose();
            }
        } catch (err) {
            toast('Failure', 5000, 'Unable to delete', '')();
        }
    };

    return (
        <>
            {
                <Popup className="add-payments add-payments_complete" dataParentId="delete_modal">
                    <PopupTitle
                        className="add-payments__title"
                        icon="/img/icons/complete.png"
                        title={`Do you want to delete this ${project ? 'project' : 'Task'}?`}
                    />

                    <div style={{ marginTop: '50px', minWidth: '30px' }}>
                        <Button
                            color="orange"
                            style={{ width: '100px' }}
                            onClick={handleCreateDiscussion}
                            data-analytics-click="delete_button"
                        >
                            <span>Delete</span>
                        </Button>
                    </div>
                </Popup>
            }
            {load && <Loader />}
        </>
    );
};

export default DeleteTask;
