import React from 'react';
import usePopup from 'hooks/usePopup';
import ProjectCreate from 'components/@popups/ProjectCreate/ProjectCreate';
import ProjectImport from 'components/@popups/ProjectImport/ProjectImport';
import ProjectNew from 'components/@popups/ProjectNew/ProjectNew';
import PopupBox from 'components/@popups/components/PopupBox/PopupBox';
import Button from 'ui/@buttons/Button/Button';
import PlusIcon from 'ui/SVG/PlusIcon';

const ProjectCreator: React.FC = () => {
    const projectCreate = usePopup();
    const projectImport = usePopup();
    const projectNew = usePopup();

    return (
        <React.Fragment>
            <Button color="green" onClick={projectNew.open}>
                <PlusIcon />
                <span>New Project</span>
            </Button>
            <PopupBox active={projectNew.active} onClose={projectNew.close}>
                <ProjectNew
                    onClose={projectNew.close}
                    openCreate={projectCreate.open}
                    openImport={projectImport.open}
                />
            </PopupBox>
            <PopupBox active={projectCreate.active} onClose={projectCreate.close}>
                <ProjectCreate />
            </PopupBox>
            <PopupBox active={projectImport.active} onClose={projectImport.close}>
                <ProjectImport />
            </PopupBox>
        </React.Fragment>
    );
};

export default ProjectCreator;
