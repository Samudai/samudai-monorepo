import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ogs from 'open-graph-scraper';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, DeleteSuccess, FetchSuccess } from '../../lib/helper/Responsehandler';
import { Blog } from '@samudai_xyz/gateway-consumer-types';

export class DAOBlogController {
    createBlog = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const blog: Blog = req.body.blog;

            const options = { url: blog.link };
            const scrapperInfo = await ogs(options);

            // console.log(scrapperInfo.result);

            blog.metadata = scrapperInfo.result;

            const result = await axios.post(`${process.env.SERVICE_DAO}/blog/create`, {
                blog,
            });
            new CreateSuccess(res, 'Blog', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while creating a blog'));
        }
    };

    listBlogForDAO = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const daoId = req.params.daoId;
            const result = await axios.get(`${process.env.SERVICE_DAO}/blog/list/${daoId}`);
            new FetchSuccess(res, 'Blog list', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while fetching a blog'));
        }
    };

    deleteBlog = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const blogId = req.params.blogId;
            const result = await axios.delete(`${process.env.SERVICE_DAO}/blog/delete/${blogId}`);
            new DeleteSuccess(res, 'Blog', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while deleting a blog'));
        }
    };
}
