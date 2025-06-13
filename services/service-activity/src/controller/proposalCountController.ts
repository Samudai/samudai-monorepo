import { Request, Response } from 'express';
import { ProposalCountQuery } from './query/proposalCountQuery';
import { ProposalCount } from '../utils/types';

export class ProposalCountController {

    proposalCountQuery: ProposalCountQuery

    constructor() {
        this.proposalCountQuery = new ProposalCountQuery();
    }

    addSnapshotProposalCount = async (req: Request, res: Response) => {
        try {
          const proposalbody : ProposalCount = req.body.proposal;
          const today = new Date();
          proposalbody.date = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
          const result = await this.proposalCountQuery.addSnapshotProposalCount(proposalbody);
          res.status(201).json({ message: 'Snapshot Proposal Data created successfully', data: result });
        } catch (err: any) {
            if (err.response) {
              return res
                .status(err.response.status)
                .send({ message: 'Could not create Activity', error: err.response.data.err });
            } else {
              return res.status(500).send({ message: 'Error creating Activity', error: err });
            }
        }
    }

    getActiveProposalsCountforDao = async (req: Request, res: Response) => {
      try {
        const dao_id: string = req.params.daoId;
        const result: any = await this.proposalCountQuery.getActiveProposalsCountforDao(dao_id);
        res.status(200).json({ pending_proposal_count: result });

      } catch (err: any) {
        if (err.response) {
          return res
            .status(err.response.status)
            .send({ message: 'Could not get Active Proposal for DAO', error: err.response.data.err });
        } else {
          return res.status(500).send({ message: 'Error getting Active Proposal for a DAO', error: JSON.stringify(err) });
        }
      }
    }

}