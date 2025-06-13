import { Request, Response } from 'express';
import { MostActive, viewCount } from '../utils/types';
import { EngagementQuery } from './query/engagement';

export class EngagementController {

    EngagementQuery : EngagementQuery;

    constructor() {
        this.EngagementQuery = new EngagementQuery();
    }

    addMostActive = async (req: Request, res: Response) => {
        try {
            const most_active: MostActive = req.body.most_active;
            
            most_active.timestamp_property = new Date().toISOString();
            const result = await this.EngagementQuery.addMostActive(most_active);
            res.status(201).json({ message: 'MostActive added successfully', data: result });
          } catch (err: any) {
            if (err.response) {
              return res
                .status(err.response.status)
                .send({ message: 'Could not add MostActive', error: err.response.data.err });
            } else {
              return res.status(500).send({ message: 'Error adding MostActive', error: err });
            }
          }
    }

    getMostActiveDAO = async (req: Request, res: Response) => {
        try{
            const result = await this.EngagementQuery.getMostActiveDAO();
            
            res.status(200).json({ data : result });
        } catch (err: any) {
            if (err.response) {
              return res
                .status(err.response.status)
                .send({ message: 'Could not get Most Active DAO', error: err.response.data.err });
            } else {
              return res.status(500).send({ message: 'Error getting Most Active DAO', error: JSON.stringify(err) });
            }
          }
    }

    getMostActiveContributor = async (req: Request, res: Response) => {
      try{
          const result = await this.EngagementQuery.getMostActiveContributor();
          
          res.status(200).json({ data : result });
      } catch (err: any) {
          if (err.response) {
            return res
              .status(err.response.status)
              .send({ message: 'Could not get Most Active Contributor', error: err.response.data.err });
          } else {
            return res.status(500).send({ message: 'Error getting Most Active Contributor', error: JSON.stringify(err) });
          }
        }
    }

    addMostViewed = async (req: Request, res: Response) => {
      try {
        const most_viewed: viewCount = req.body.most_viewed;
        
        const today = new Date();
        most_viewed.date = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
        const result = await this.EngagementQuery.addMostViewed(most_viewed);
        res.status(201).json({ message: 'MostViewed added successfully', data: result });
      } catch (err: any) {
        if (err.response) {
          return res
            .status(err.response.status)
            .send({ message: 'Could not add MostViewed', error: err.response.data.err });
        } else {
          return res.status(500).send({ message: 'Error adding MostViewed', error: err });
        }
      }
    }

    getMostViewedDAO = async (req: Request, res: Response) => {
      try{
          const result = await this.EngagementQuery.getMostViewedDAO();
          
          res.status(200).json({ data : result });
      } catch (err: any) {
          if (err.response) {
            return res
              .status(err.response.status)
              .send({ message: 'Could not get Most Viewed DAO', error: err.response.data.err });
          } else {
            return res.status(500).send({ message: 'Error getting Most Viewed DAO', error: JSON.stringify(err) });
          }
        }
    }

    getMostViewedContributor = async (req: Request, res: Response) => {
      try{
        const result = await this.EngagementQuery.getMostViewedContributor();
        
        res.status(200).json({ data : result });
      } catch (err: any) {
        if (err.response) {
          return res
            .status(err.response.status)
            .send({ message: 'Could not get Most Viewed Contributor', error: err.response.data.err });
        } else {
          return res.status(500).send({ message: 'Error getting Most Viewed Contributor', error: JSON.stringify(err) });
        }
      }
  }
}