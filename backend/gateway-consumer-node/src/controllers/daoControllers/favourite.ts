import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, DeleteSuccess, FetchSuccess } from '../../lib/helper/Responsehandler';
import { FavouriteDAO } from '@samudai_xyz/gateway-consumer-types';

export class DAOFavouriteController {
    createFavourite = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const favouriteDAO: FavouriteDAO = req.body.favouriteDAO;
            const result = await axios.post(`${process.env.SERVICE_DAO}/favourite/create`, {
                favourite: favouriteDAO,
            });
            new CreateSuccess(res, 'Favourite', result);
        } catch (err: any) {
            if (
                err.response.data.error.includes('duplicate key value violates unique constraint') ||
                err.response.data.error.includes('no rows in result set')
            ) {
                return res.status(409).json({ message: 'Favourite already present' });
            } else {
                next(new ErrorException(err, 'Error while creating a favourite'));
            }
        }
    };

    getFavourite = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const member_id = req.params.memberId;
            const page: string = req.query.page ? (req.query.page as string) : '1';
            const limit = 10;
            const offset = (parseInt(page) - 1) * limit;
            const result = await axios.post(`${process.env.SERVICE_DAO}/favourite/bymemberid/${member_id}`, {
                limit,
                offset,
            });
            new FetchSuccess(res, 'Favourite', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a favourite'));
        }
    };

    deleteFavourite = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const favouriteId = req.params.favouriteId;
            const result = await axios.delete(`${process.env.SERVICE_DAO}/favourite/delete/${favouriteId}`);
            new DeleteSuccess(res, 'Favourite', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while deleting a favourite'));
        }
    };

    countFavouriteForDAO = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const daoId = req.params.daoId;
            const result = await axios.get(`${process.env.SERVICE_DAO}/favourite/countbydao/${daoId}`);
            new FetchSuccess(res, 'Favourite Count', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching favourite count'));
        }
    };
}
