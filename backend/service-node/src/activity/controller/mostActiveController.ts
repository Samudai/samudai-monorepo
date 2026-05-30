import { Request, Response } from 'express';
import { mostActiveQuery } from "./query/mostActiveQuery"

export class MostActiveController {

    mostActiveQuery : mostActiveQuery;

    constructor () {
        this.mostActiveQuery = new mostActiveQuery
    }

    mostActiveDao = async (req: Request, res: Response) => {
        try{
            const mostActiveDAO = await this.mostActiveQuery.mostActiveDao();
            res.status(200).json({ message: 'Most active DAO retrieved successfully', dao: mostActiveDAO![0] });
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

    mostActiveContributor = async (req: Request, res: Response) => {
        try{
            const mostActiveContributor = await this.mostActiveQuery.mostActiveContributor();
            res.status(200).json({ message: 'Most active Contributor retrieved successfully', contributor: mostActiveContributor![0] });
        }
        catch(err : any) {
            if (err.response) {
                return res
                  .status(err.response.status)
                  .send({ message: 'Could not get most active Contributor', error: err.response.data.err });
              } else {
                return res.status(500).send({ message: 'Error getting most active Contributor', error: JSON.stringify(err) });
            }
        }
    }
}