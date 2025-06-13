import { Request, Response } from 'express';
import { Activity } from '../utils/types';
import { ActivityQuery } from './query/activity';

export class ActivityController {
  ActivityQuery: ActivityQuery;

  constructor() {
    this.ActivityQuery = new ActivityQuery();
  }

  addActivity = async (req: Request, res: Response) => {
    try {
      const activity: Activity = req.body.activity;
      activity.timestamp_property = new Date().toISOString();
      const result = await this.ActivityQuery.addActivity(activity);
      res.status(201).json({ message: 'Activity created successfully', data: result });
    } catch (err: any) {
      if (err.response) {
        return res
          .status(err.response.status)
          .send({ message: 'Could not create Activity', error: err.response.data.err });
      } else {
        return res.status(500).send({ message: 'Error creating Activity', error: err });
      }
    }
  };

  getActivityByDAO = async (req: Request, res: Response) => {
    try {
      const dao_id: string = req.params.daoId;
      const result: any = await this.ActivityQuery.getLastestActivitiesbyDAO(dao_id);
      res.status(200).json({ message: 'Activity retrieved successfully', data: result });
    } catch (err: any) {
      if (err.response) {
        return res
          .status(err.response.status)
          .send({ message: 'Could not get Activity for DAO', error: err.response.data.err });
      } else {
        return res.status(500).send({ message: 'Error getting Activity for a DAO', error: JSON.stringify(err) });
      }
    }
  };

  getActivitybyAction = async (req: Request, res: Response) => {
    try {
      const dao_id: string = req.params.daoId;
      const action: string = req.params.action;
      const result: any = await this.ActivityQuery.getActivitybyAction(dao_id, action);
      res.status(200).json({ message: 'Activity retrieved successfully', data: result });
    } catch (err: any) {
      if (err.response) {
        return res
          .status(err.response.status)
          .send({ message: 'Could not get Activity for DAO', error: err.response.data.err });
      } else {
        return res.status(500).send({ message: 'Error getting Activity for a DAO', error: JSON.stringify(err) });
      }
    }
  };

  getActivitybyMemberForDAO = async (req: Request, res: Response) => {
    try {
      const dao_id: string = req.params.daoId;
      const member_id: string = req.params.memberId;
      const result: any = await this.ActivityQuery.getActivitybyMemberForDAO(dao_id, member_id);
      res.status(200).json({ message: 'Activity retrieved successfully', data: result });
    } catch (err: any) {
      if (err.response) {
        return res
          .status(err.response.status)
          .send({ message: 'Could not get Activity for DAO', error: err.response.data.err });
      } else {
        return res.status(500).send({ message: 'Error getting Activity for a DAO', error: JSON.stringify(err) });
      }
    }
  };

  getActivitybyProject = async (req: Request, res: Response) => {
    try {
      const project_id: string = req.params.projectId;
      const result: any = await this.ActivityQuery.getActivitybyProject(project_id);
      res.status(200).json({ message: 'Activity retrieved successfully', data: result });
    } catch (err: any) {
      if (err.response) {
        return res
          .status(err.response.status)
          .send({ message: 'Could not get Activity for DAO', error: err.response.data.err });
      } else {
        return res.status(500).send({ message: 'Error getting Activity for a DAO', error: JSON.stringify(err) });
      }
    }
  };

  getActivitybyTask = async (req: Request, res: Response) => {
    try {
      const task_id: string = req.params.taskId;
      const result: any = await this.ActivityQuery.getActivitybyTask(task_id);
      res.status(200).json({ message: 'Activity retrieved successfully', data: result });
    } catch (err: any) {
      if (err.response) {
        return res
          .status(err.response.status)
          .send({ message: 'Could not get Activity for DAO', error: err.response.data.err });
      } else {
        return res.status(500).send({ message: 'Error getting Activity for a DAO', error: JSON.stringify(err) });
      }
    }
  };

  getActivityByVisibilityForDAO = async (req: Request, res: Response) => {
    try {
      const dao_id: string = req.params.daoId;
      const visibility: string = req.params.visibility;
      const result: any = await this.ActivityQuery.getActivityByVisibilityForDAO(dao_id, visibility);
      res.status(200).json({ message: 'Activity retrieved successfully', data: result });
    } catch (err: any) {
      if (err.response) {
        return res
          .status(err.response.status)
          .send({ message: 'Could not get Activity for DAO', error: err.response.data.err });
      } else {
        return res.status(500).send({ message: 'Error getting Activity for a DAO', error: JSON.stringify(err) });
      }
    }
  };

  getActivityByDiscussion = async (req: Request, res: Response) => {
    try {
      const discussion_id: string = req.params.discussionId;
      const result: any = await this.ActivityQuery.getActivityByDiscussion(discussion_id);
      res.status(200).json({ message: 'Activity retrieved successfully', data: result });
    } catch (err: any) {
      if (err.response) {
        return res
          .status(err.response.status)
          .send({ message: 'Could not get Activity for DAO', error: err.response.data.err });
      } else {
        return res.status(500).send({ message: 'Error getting Activity for a DAO', error: JSON.stringify(err) });
      }
    }
  };

  getActivityByMember = async (req: Request, res: Response) => { 
    try {
      const member_id: string = req.params.memberId;
      const result: any = await this.ActivityQuery.getActivityByMember(member_id);
      res.status(200).json({ message: 'Activity retrieved successfully', data: result });
    } catch (err: any) {
      if (err.response) {
        return res
          .status(err.response.status)
          .send({ message: 'Could not get Activity for DAO', error: err.response.data.err });
      } else {
        return res.status(500).send({ message: 'Error getting Activity for a DAO', error: JSON.stringify(err) });
      }
    }
  }
}
