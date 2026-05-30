import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { CreateSuccess, DeleteSuccess, FetchSuccess, UpdateSuccess } from '../../lib/helper/Responsehandler';
import * as fs from 'fs';
const path = require('path');
import ejs from 'ejs';

export class SubdomainController {
    requestSubdomain = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const memberId = req.body.memberId;
            const walletAddress = req.body.walletAddress;
            const subdomain = req.body.subdomain;
            const result = await axios.post(`${process.env.SERVICE_MEMBER}/onboarding/requestsubdomain`, {
                member_id: memberId,
                wallet_address: walletAddress,
                subdomain: subdomain,
            });
            new UpdateSuccess(res, 'MEMBER Subdomain', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while requesting subdomain'));
        }
    };

    checkSubdomainForMember = async (req: Request, res: Response) => {
        try {
            const subdomain = req.params.subdomain;

            const result = await axios.get(`${process.env.SERVICE_MEMBER}/onboarding/checksubdomain/${subdomain}`);

            return res.status(201).send({
                message: 'Subdomain successfully checked for Member',
                data: result.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res
                    .status(err.response.status)
                    .send({ message: 'Something went wrong while checking subdomain', error: err.response.data });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };

    fetchSubdomainByMemberId = async (req: Request, res: Response) => {
        try {
            const member_id = req.params.memberId;

            const result = await axios.get(
                `${process.env.SERVICE_MEMBER}/onboarding/fetchsubdomainformember/${member_id}`
            );

            return res.status(201).send({
                message: 'Subdomain successfully fetched for Member',
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

    getCID = async (req: Request, res: Response) => {
        try {
            const memberId = req.params.memberId;
            const subdomain = req.params.subdomain;

            const inputFilePath = path.join(__dirname, '../../input.html');
            const outputFilePath = path.join(__dirname, `../../${memberId}.html`);
            let response;

            if (fs.existsSync(inputFilePath)) {
                let htmlFile = fs.readFileSync(inputFilePath).toString();

                htmlFile = htmlFile.replace('host', process.env.SAMUDAI_URL!);
                htmlFile = htmlFile.replace('MEMBER_ID', memberId);
                htmlFile = htmlFile.replace('XYZ', subdomain);

                fs.writeFileSync(outputFilePath, htmlFile);
                response = 'xyz';
                fs.rmSync(outputFilePath);
            } else {
                console.log('Not found');
            }

            return res.status(201).send({
                message: 'Members Info successfully fetched',
                data: {cid : response},
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

    createSubdomain = async (req: Request, res: Response) => {
        try {
            const subdomain = req.body.subdomain;

            const result = await axios.post(`${process.env.SERVICE_MEMBER}/subdomain/add`, {
                subdomain,
            });

            const subdomainUpdate = await axios.post(`${process.env.SERVICE_MEMBER}/member/update/subdomain`, {
                member_id: subdomain.member_id,
                subdomain: subdomain.subdomain,
            });

            return res.status(201).send({
                message: 'Subdomain successfully added for Member',
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
    };

    getSubdomainForMember = async (req: Request, res: Response) => {
        try {
            const memberId = req.params.member_id;
            const subdomain = req.params.subdomain;

            const result = await axios.get(`${process.env.SERVICE_MEMBER}/subdomain/get/${memberId}/${subdomain}`);

            return res.status(201).send({
                message: 'Subdomain successfully fetched for Member',
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

    checkSubdomainCreateForMember = async (req: Request, res: Response) => {
        try {
            const memberId = req.params.member_id;

            const result = await axios.get(`${process.env.SERVICE_MEMBER}/subdomain/checksubdomaincreate/${memberId}`);

            return res.status(201).send({
                message: 'Subdomain create access successfully fetched for Member',
                data: result.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(err.response.status).send({
                    message: 'Something went wrong while checking subdomain access',
                    error: err.response.data,
                });
            } else {
                return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
            }
        }
    };
}
