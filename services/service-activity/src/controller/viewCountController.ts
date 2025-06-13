import { Request, Response } from 'express';
import { ViewCountQuery } from './query/viewCountQuery';
import { viewCount } from '../utils/types';

export class ViewCountController {

    ViewCountQuery : ViewCountQuery;

    constructor(){
        this.ViewCountQuery = new ViewCountQuery();
    }

    addDiscoveryViews = async (req: Request, res: Response) => {
        try {
            const view_count: viewCount = req.body;

            const today = new Date();
            const todayUtc = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

            view_count.date = todayUtc;
            
            const result = await this.ViewCountQuery.addDiscoveryView(view_count);
            res.status(201).json({ message: 'DiscoveryView added successfully', data: result });
          } catch (err: any) {
            if (err.response) {
              return res
                .status(err.response.status)
                .send({ message: 'Could not add DiscoveryView', error: err.response.data.err });
            } else {
              return res.status(500).send({ message: 'Error adding DiscoveryView', error: err });
            }
          }
    }

    getMostViewedDAO = async (req: Request, res: Response) => {
      try{
        const mostViewedDAO = await this.ViewCountQuery.mostViewedDao();
        res.status(200).json({ message: 'Most viewed DAO retrieved successfully', dao: mostViewedDAO![0] });
      }
      catch(err : any) {
          if (err.response) {
              return res
                .status(err.response.status)
                .send({ message: 'Could not get most active DAO', error: err.response.data.err });
            } else {
              return res.status(500).send({ message: 'Error getting most active DAO', error: JSON.stringify(err) });
          }
      }
    }

    getMostViewedContributor = async (req: Request, res: Response) => {
      try{
        const mostViewedDAO = await this.ViewCountQuery.mostViewedContributor();
        res.status(200).json({ message: 'Most viewed Contributor retrieved successfully', contributor: mostViewedDAO![0] });
      }
      catch(err : any) {
          if (err.response) {
              return res
                .status(err.response.status)
                .send({ message: 'Could not get most viewed Contributor', error: err.response.data.err });
            } else {
              return res.status(500).send({ message: 'Error getting most viewed Contributor', error: JSON.stringify(err) });
          }
      }
    }
}