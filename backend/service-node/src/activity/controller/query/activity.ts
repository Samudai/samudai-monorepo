import { ActivitySchema } from '../../models/activitySchema';
import { Activity } from '../../utils/types';

export class ActivityQuery {
  addActivity = async (activity: Activity) => {
    try {
      const newActivity = await ActivitySchema.create(activity);
      console.log(newActivity);
    } catch (err: any) {
      console.log(err);
    }
  };

  getLastestActivitiesbyDAO = async (dao_id: string) => {
    try {
      const activities = await ActivitySchema.find({ dao_id: dao_id }).sort({ timestamp_property: -1 }).limit(100);
      return activities;
    } catch (err: any) {
      console.log(err);
    }
  };

  getActivitybyAction = async (dao_id: string, action: string) => {
    try {
      const activities = await ActivitySchema.find({ dao_id: dao_id, action_type: action })
        .sort({ timestamp_property: -1 })
        .limit(50);
      return activities;
    } catch (err: any) {
      console.log(err);
    }
  };

  getActivitybyMemberForDAO = async (dao_id: string, member_id: string) => {
    try {
      const activities = await ActivitySchema.find({ dao_id: dao_id, member_id: member_id })
        .sort({ timestamp_property: -1 })
        .limit(50);
      return activities;
    } catch (err: any) {
      console.log(err);
    }
  };

  getActivitybyProject = async (project_id: string) => {
    try {
      const activities = await ActivitySchema.find({ project_id: project_id })
        .sort({ timestamp_property: -1 })
        .limit(50);
      return activities;
    } catch (err: any) {
      console.log(err);
    }
  };

  getActivitybyTask = async (task_id: string) => {
    try {
      const activities = await ActivitySchema.find({ task_id: task_id }).sort({ timestamp_property: -1 }).limit(50);
      return activities;
    } catch (err: any) {
      console.log(err);
    }
  };

  getActivityByVisibilityForDAO = async (dao_id: string, visibility: string) => {
    try {
      const activities = await ActivitySchema.find({ dao_id: dao_id, visibility: visibility })
        .sort({ timestamp_property: -1 })
        .limit(50);
      return activities;
    } catch (err: any) {
      console.log(err);
    }
  };

  getActivityByDiscussion = async (discussion_id: string) => {
    try {
      const activities = await ActivitySchema.find({ discussion_id: discussion_id })
        .sort({ timestamp_property: -1 })
        .limit(50);
      return activities;
    } catch (err: any) {
      console.log(err);
    }
  };

  getActivityByMember = async (member_id: string) => {
    try {
      const activities = await ActivitySchema.find({ member_id: member_id }).sort({ timestamp_property: -1 }).limit(50);
      return activities;
    } catch (err: any) {
      console.log(err);
    }
  };
}
