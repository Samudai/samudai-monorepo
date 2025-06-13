import { Request, Response } from 'express';

import { OnboardingQuery } from './query/onboardingQuery';

export class OnboardingController {
  onboardingQuery: OnboardingQuery;

  constructor() {
    this.onboardingQuery = new OnboardingQuery();
  }

  addStep = async (req: Request, res: Response) => {
    try {
      const link_id: string = req.body.link_id;
      const step_id: string = req.body.step_id;
      const value: any = req.body.value;
      const result = await this.onboardingQuery.addStep(link_id, step_id, value);
      res.status(201).json({ message: 'Step added successfully', data: result });
    } catch (err: any) {
      if (err.response) {
        return res.status(err.response.status).send({ message: 'Could not add Step', error: err.response.data.err });
      } else {
        return res.status(500).send({ message: 'Error adding Step', error: err });
      }
    }
  };

  getOnboarding = async (req: Request, res: Response) => {
    try {
      const link_id: string = req.params.linkId;
      const result: any = await this.onboardingQuery.getOnboarding(link_id);
      res.status(200).json({ message: 'Onboarding retrieved successfully', data: result });
    } catch (err: any) {
      if (err.response) {
        return res
          .status(err.response.status)
          .send({ message: 'Could not get Onboarding for member', error: err.response.data.err });
      } else {
        return res.status(500).send({ message: 'Error getting Onboarding for a member', error: JSON.stringify(err) });
      }
    }
  };

  getOnboardingByStep = async (req: Request, res: Response) => {
    try {
      const link_id: string = req.params.linkId;
      const step_id: string = req.params.stepId;
      const result: any = await this.onboardingQuery.getStep(link_id, step_id);
      res.status(200).json({ message: 'Onboarding retrieved successfully', data: result });
    } catch (err: any) {
      if (err.response) {
        return res
          .status(err.response.status)
          .send({ message: 'Could not get Onboarding for member', error: err.response.data.err });
      } else {
        return res.status(500).send({ message: 'Error getting Onboarding for a member', error: JSON.stringify(err) });
      }
    }
  };

  deleteOnboarding = async (req: Request, res: Response) => {
    try {
      const link_id: string = req.params.linkId;
      const result = await this.onboardingQuery.deleteOnboarding(link_id);
      res.status(200).json({ message: 'Onboarding deleted successfully', data: result });
    } catch (err: any) {
      if (err.response) {
        return res
          .status(err.response.status)
          .send({ message: 'Could not delete Onboarding', error: err.response.data.err });
      } else {
        return res.status(500).send({ message: 'Error deleting Onboarding', error: JSON.stringify(err) });
      }
    }
  };
}
