import { Request, Response } from 'express';
import { AccessControlConditions, ResourceId } from '../utils/types';
import { TokenGatingQuery } from './query/tokenGating';

export class TokenGatingController {
  tokenGatingQuery: TokenGatingQuery;

  constructor() {
    this.tokenGatingQuery = new TokenGatingQuery();
  }

  addTokenGating = async (req: Request, res: Response) => {
    try {
      const dao_id: string = req.body.dao_id;
      const accessControlConditions: AccessControlConditions = req.body.accessControlConditions;
      const resourceId: ResourceId = req.body.resourceId;
      const result = await this.tokenGatingQuery.addTokenGating(dao_id, accessControlConditions, resourceId);
      res.status(201).json({ message: 'Token Gating creating Successfully', data: result });
    } catch (err: any) {
      if (err.response) {
        return res
          .status(err.response.status)
          .send({ message: 'Could not create token gating', error: err.response.data.err });
      } else {
        return res.status(500).send({ message: 'Error creating token gating', error: err });
      }
    }
  };

  getTokenGating = async (req: Request, res: Response) => {
    try {
      const dao_id: string = req.params.daoId;
      const result = await this.tokenGatingQuery.getTokenGating(dao_id);
      res.status(200).json({ message: 'Token Gating fetched Successfully', data: result });
    } catch (err: any) {
      if (err.response) {
        return res
          .status(err.response.status)
          .send({ message: 'Could not fetch token gating', error: err.response.data.err });
      } else {
        return res.status(500).send({ message: 'Error fetching token gating', error: err });
      }
    }
  };

  deleteTokenGating = async (req: Request, res: Response) => {
    try {
      const dao_id: string = req.params.daoId;
      const result = await this.tokenGatingQuery.deleteTokenGating(dao_id);
      res.status(200).json({ message: 'Token Gating deleted Successfully', data: result });
    } catch (err: any) {
      if (err.response) {
        return res
          .status(err.response.status)
          .send({ message: 'Could not delete token gating', error: err.response.data.err });
      } else {
        return res.status(500).send({ message: 'Error deleting token gating', error: err });
      }
    }
  };
}
