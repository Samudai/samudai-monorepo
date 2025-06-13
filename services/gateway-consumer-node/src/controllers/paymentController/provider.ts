import axios from 'axios';
import { Request, Response } from 'express';
import { Provider } from '@samudai_xyz/gateway-consumer-types';

export class ProviderController {
    create = async (req: Request, res: Response) => {
        try {
            const provider: Provider = req.body.provider;
            const response = await axios.post(`${process.env.SERVICE_DAO}/provider/create`, {
                provider,
            });
            res.status(200).send({
                message: 'Provider added successfully',
                data: response.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Provider could not be added!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from Provider',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    getProviderById = async (req: Request, res: Response) => {
        try {
            const providerId = req.params.providerId;

            const result = await axios.get(`${process.env.SERVICE_DAO}/provider/get/${providerId}`);

            return res.status(200).send({
                message: 'Provider Fetched Successfully',
                data: result.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Provider could not be retrieved!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from Provider',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    getProviderForDAO = async (req: Request, res: Response) => {
        try {
            const daoId = req.params.daoId;
            const response = await axios.get(`${process.env.SERVICE_DAO}/provider/list/${daoId}`);
            if (response.data.provider_list !== null) {
                return res.status(200).send({
                    message: 'Providers retrieved successfully',
                    data: { data: response.data.provider_list },
                });
            } else {
                return res.status(200).send({
                    message: 'No Providers found',
                    data: { data: [] },
                });
            }
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Providers could not be retrieved!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from Provider',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    updateProvider = async (req: Request, res: Response) => {
        try {
            const provider: Provider = req.body.provider;
            const response = await axios.post(`${process.env.SERVICE_DAO}/provider/update`, {
                provider,
            });
            res.status(200).send({
                message: 'Provider updated successfully',
                data: response.data.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Provider could not be updated!',
                    error: err.response.data.error,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from Provider',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    deleteProvider = async (req: Request, res: Response) => {
        try {
            const providerId = req.params.providerId;
            const response = await axios.delete(`${process.env.SERVICE_DAO}/provider/delete/${providerId}`);
            res.status(200).send({
                message: 'Provider deleted successfully',
                data: response.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Provider could not be deleted!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from Provider',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    getChainList = async (req: Request, res: Response) => {
        try {
            const response = await axios.get(`${process.env.SERVICE_MEMBER}/chain/list`);
            res.status(200).send({
                message: 'Chain list retrieved successfully',
                data: response.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Chain list could not be retrieved!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from Chain list',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    getDAODefaultProvider = async (req: Request, res: Response) => {
        try {
            const daoId = req.params.daoId;
            const response = await axios.get(`${process.env.SERVICE_DAO}/provider/default/${daoId}`);
            res.status(200).send({
                message: 'Default provider retrieved successfully',
                data: response.data.provider,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Default provider could not be retrieved!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from Default provider',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    doesExistProvider = async (req: Request, res: Response) => {
        try {
            const providerId = req.params.providerId;
            const response = await axios.get(`${process.env.SERVICE_DAO}/provider/exists/${providerId}`);
            res.status(200).send({
                message: 'Provider checked successfully',
                data: response.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Error Checking Provider',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from Provider',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    updateDefaultProvider = async (req: Request, res: Response) => {
        try {
            const dao_id = req.body.daoId;
            const provider_id = req.body.providerId;
            const is_default = true;
            const response = await axios.post(`${process.env.SERVICE_DAO}/provider/update/default`, {
                dao_id,
                provider_id: provider_id.toString(),
                is_default,
            });
            res.status(200).send({
                message: 'Default provider updated successfully',
                data: response.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Default provider could not be updated!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from Default provider',
                    error: JSON.stringify(err),
                });
            }
        }
    };
}
