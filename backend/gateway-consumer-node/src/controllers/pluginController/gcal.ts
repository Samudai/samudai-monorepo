import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { DeleteSuccess, UniversalSuccess } from '../../lib/helper/Responsehandler';

export class GcalController {
    serviceGcal = `${process.env.SERVICE_PLUGIN}/plugins/gcal`;

    auth = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const link_id = req.body.linkId;
            const code = req.body.code;
            const redirect_uri = req.body.redirectUri;

            const response = await axios.post(`${this.serviceGcal}/auth`, {
                link_id,
                code,
                redirect_uri,
            });

            // //get value of redirect_uri after slash in the url
            // const type = redirect_uri.split('/').pop();
            // if (type === 'gcaluser') {
            //     let onboardingStatus = false;

            //     const onboardingResult = await axios.get(`${process.env.SERVICE_MEMBER}/onboarding/${link_id}`);

            //     if (onboardingResult.data) {
            //         if (
            //             onboardingResult.data.onboarding.admin === false &&
            //             onboardingResult.data.onboarding.contributor === false
            //         ) {
            //             onboardingStatus = false;
            //         } else if (
            //             onboardingResult.data.onboarding.admin === true ||
            //             onboardingResult.data.onboarding.contributor === true
            //         ) {
            //             onboardingStatus = true;
            //         } else {
            //             onboardingStatus = false;
            //         }
            //     } else {
            //         onboardingStatus = false;
            //     }

            //     if (!onboardingStatus) {
            //         const onboardingResult = await axios.post(`${process.env.SERVICE_ACTIVITY}/onboarding/add`, {
            //             link_id: link_id,
            //             step_id: MemberOnboardingFlowStep.INTEGRATIONS,
            //             value: {
            //                 'google calendar': {
            //                     code: code,
            //                     redirect_uri: redirect_uri,
            //                 },
            //             },
            //         });
            //     }
            // } else if (type === 'gcaldao') {
            //     const daoResult = await axios.get(`${process.env.SERVICE_DAO}/dao/${link_id}`);
            //     const dao = daoResult.data.dao;

            //     if (!dao.onboarding) {
            //         const onboardingResult = await axios.post(`${process.env.SERVICE_ACTIVITY}/onboarding/add`, {
            //             link_id: link_id,
            //             step_id: DAOOnboardingFlowStep.INTEGRATIONS,
            //             value: {
            //                 'google calendar': {
            //                     code: code,
            //                     redirect_uri: redirect_uri,
            //                 },
            //             },
            //         });
            //     }
            // }
            return res.status(200).send({
                message: 'Gcal Auth successful',
                data: response.data,
            });
        } catch (err: any) {
            console.log(err);
            if (err.response) {
                return res.status(400).send({
                    message: 'Gcal Auth failed!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from gcal',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    getCalAccessForMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const link_id = req.params.linkId;
            const response = await axios.get(`${this.serviceGcal}/access/${link_id}`);
            return res.status(200).send({
                message: 'Gcal Auth successful',
                data: response.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Gcal Auth failed!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from gcal',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    deleteGcalAccessForMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const link_id = req.params.linkId;
            const response = await axios.delete(`${this.serviceGcal}/${link_id}`);
            return res.status(200).send({
                message: 'Gcal Auth successful',
                data: response.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Gcal Auth failed!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from gcal',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    linkExists = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const link_id = req.params.linkId;
            const response = await axios.get(`${this.serviceGcal}/exists/${link_id}`);
            return res.status(200).send({
                message: 'Gcal Auth successful',
                data: response.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Gcal Auth failed!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from gcal',
                    error: JSON.stringify(err),
                });
            }
        }
    };
}
