import { IMember } from "../../utils/types"

export type viewedProfileNotificationMetaData = { 
    member : IMember;
    viewer_id : string;
    viewed_member_id : string;
    redirect_link?: string;
}

export type MostActiveNotificationMetaData = {
    most_active_type : string;
    most_active_id : string;
    redirect_link?: string;
}

