import axios from 'axios';
import { NextFunction, Request, Response } from 'express';

export class DAOSubdomainController {
    createSubdomain = async (req: Request, res: Response) => {
        try{
            const subdomain = req.body.subdomain;

            const result = await axios.post(`${process.env.SERVICE_DAO}/subdomain/add`, {
                subdomain
            });

            return res.status(201).send({
                message: 'Subdomain successfully added for Dao',
                data: result.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while adding subdomain', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    }

    getSubdomainForDao = async (req: Request, res: Response) => {
        try{ 
            const daoId = req.params.dao_id;
            const subdomain = req.params.subdomain;

            const result = await axios.get(`${process.env.SERVICE_DAO}/subdomain/get/${daoId}/${subdomain}`);

            return res.status(201).send({
                message: 'Subdomain successfully fetched for Dao',
                data: result.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while fetching subdomain', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    checkSubdomainCreateForDao = async (req: Request, res: Response) => {
        try{ 
            const daoId = req.params.dao_id;

            const result = await axios.get(`${process.env.SERVICE_DAO}/subdomain/checksubdomaincreate/${daoId}`);

            return res.status(201).send({
                message: 'Subdomain create access successfully fetched for Dao',
                data: result.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while checking subdomain access', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    }
    
}
