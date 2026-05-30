import { Request, Response } from 'express';

import { ProgressBarQuery } from './query/progressBarQuery';

export class ProgressBarController {

    progressBarQuery : ProgressBarQuery;

    constructor() {
        this.progressBarQuery = new ProgressBarQuery();
    }

    updateDAOProgressBar = async (req: Request, res: Response) => {
        try{
            const dao_id: string = req.body.dao_id;
            const item_id: string[] = req.body.item_id;

            const result = await this.progressBarQuery.updateDAOProgressBar(dao_id, item_id)
            res.status(201).json({ message: 'Created or Updated DAO Progress Bar successfully', data: result });
        }
        catch (err : any) {
            if (err.response) {
                return res.status(err.response.status).send({ message: 'Could not update progress bar for Dao', error: err.response.data.err });
              } else {
                return res.status(500).send({ message: 'Error updating progress bar for Dao', error: err });
              }
        }
    }

    getDAOProgressBar = async (req: Request, res: Response) => {
        try{
            const dao_id: string = req.params.daoId;
        
            const result = await this.progressBarQuery.getDAOProgressBar(dao_id);
            res.status(200).json({ message: 'DAO Progress Bar retrieved successfully', data: result });
        } catch (err: any) {
            if (err.response) {
              return res
                .status(err.response.status)
                .send({ message: 'Could not get DAO Progress Bar', error: err.response.data.err });
            } else {
              return res.status(500).send({ message: 'Error getting DAO Progress Bar', error: JSON.stringify(err) });
            }
          }
    }

    updateContributorProgressBar = async (req: Request, res: Response) => {
        try{
            const member_id: string = req.body.member_id;
            const item_id: string[] = req.body.item_id;

            const result = await this.progressBarQuery.updateContributorProgressBar(member_id, item_id)
            res.status(201).json({ message: 'Created or Updated Contributor Progress Bar successfully', data: result });
        }
        catch (err : any) {
            if (err.response) {
                return res.status(err.response.status).send({ message: 'Could not update progress bar for Contributor', error: err.response.data.err });
              } else {
                return res.status(500).send({ message: 'Error updating progress bar for Contributor', error: err });
              }
        }
    }


    getContributorProgressBar = async (req: Request, res: Response) => {
        try{
            const member_id: string = req.params.memberId;
        
            const result = await this.progressBarQuery.getContributorProgressBar(member_id);
            res.status(200).json({ message: 'Contributor Progress Bar retrieved successfully', data: result });
        } catch (err: any) {
            if (err.response) {
              return res
                .status(err.response.status)
                .send({ message: 'Could not get Contributor Progress Bar', error: err.response.data.err });
            } else {
              return res.status(500).send({ message: 'Error getting Contributor Progress Bar', error: JSON.stringify(err) });
            }
          }
    }

}