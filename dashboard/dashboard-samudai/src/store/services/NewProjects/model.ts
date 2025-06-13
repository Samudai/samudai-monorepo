import {
    LinkType,
    ProjectType,
} from '@samudai_xyz/gateway-consumer-types/dist/types/project/enums';

export interface createProjectRequest {
    title: string;
    created_by: string;
    link_id: string;
    type: LinkType;
    project_type: ProjectType;
}
