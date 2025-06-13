import { Request, Response } from 'express';
import { AdminQuery } from './query/admin';
import { Admin } from '../utils/types';

export class AdminController {

    AdminQuery : AdminQuery;

    constructor() {
        this.AdminQuery = new AdminQuery();
    }

    addAdminsForSamudaiDao =  async (req: Request, res: Response) => {
        try {
            const admin: Admin = req.body.admin;
            admin.date = new Date().toISOString();
            const result = await this.AdminQuery.addAdmin(admin);
            res.status(201).json({ message: 'Dao Admin added successfully', data: result });
          } catch (err: any) {
            if (err.response) {
              return res
                .status(err.response.status)
                .send({ message: 'Could not add Dao Admin', error: err.response.data.err });
            } else {
              return res.status(500).send({ message: 'Error adding Dao Admin', error: err });
            }
          }
    }
}