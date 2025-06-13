import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectEnums, ProjectResponse } from '@samudai_xyz/gateway-consumer-types';
import { changeProjectid } from 'store/features/common/slice';
import { useUpdatePinnedMutation } from 'store/services/projects/totalProjects';
import { useTypedDispatch } from 'hooks/useStore';
import { toast } from 'utils/toast';
import { getMemberId } from 'utils/utils';
import { updatePinnedProject } from 'store/features/projects/projectSlice';

export const useProject = (data: ProjectResponse, board = false) => {
    const [bookmark, setBookmark] = useState(!!data.pinned);
    const [updatePinned] = useUpdatePinnedMutation();
    const isPrivate = data.visibility === 'private' && !board;
    const navigate = useNavigate();
    const dispatch = useTypedDispatch();

    const onPinned = async () => {
        const isBookmark = bookmark;
        setBookmark(!bookmark);
        try {
            await updatePinned({
                projectId: data.project_id!,
                pinned: !bookmark,
                linkId: data.link_id!,
                updatedBy: getMemberId(),
            }).unwrap();

            dispatch(updatePinnedProject({ pinned: !bookmark, project_id: data.project_id! }));

            // if (isBookmark) {
            //     dispatch(addPinnedProject({ pinned: data.project_id! }));
            // } else {
            //     dispatch(removePinnedProject({ pinned: data.project_id! }));
            // }
        } catch (err: any) {
            setBookmark(isBookmark);
            toast('Failure', 5000, 'error', err?.data?.message)();
        }
    };

    const onNavigate = async (ev: React.MouseEvent<HTMLDivElement>) => {
        const target = ev.target as HTMLDivElement;

        if (target.closest('button')) {
            ev.preventDefault();
            return;
        }

        if (isPrivate) {
            toast('Attention', 5000, 'Unable to open project', 'This project is private');
            return;
        } else if (data.project_type === ProjectEnums.ProjectType.INVESTMENT) {
            dispatch(changeProjectid({ projectid: data.project_id! }));
            setTimeout(() => {
                navigate(`/${data.link_id}/forms/${data.project_id}/board`);
            }, 100);
        } else if (
            data.project_type === ProjectEnums.ProjectType.INTERNAL ||
            ProjectEnums.ProjectType.DEFAULT
        ) {
            dispatch(changeProjectid({ projectid: data.project_id! }));
            setTimeout(() => {
                navigate(`/${data.link_id}/projects/${data.project_id}/board`);
            }, 100);
        }
    };

    return {
        bookmark,
        isPrivate,
        onPinned,
        onNavigate,
    };
};
