import axios from 'axios';
import { Request, Response } from 'express';
import {
    Discussion,
    DiscussionResponse,
    Message,
    MessageResponse,
    Participant,
    UpdateBookmark,
    BulkParticipantRequest,
} from '@samudai_xyz/gateway-consumer-types';

export class DiscussionController {
    create = async (req: Request, res: Response) => {
        try {
            const discussion: Discussion = req.body.discussion;
            const participants: string[] = req.body.participants;
            const response = await axios.post(`${process.env.SERVICE_DISCUSSION}/discussion/create`, {
                discussion,
            });
            const discussionId: string = response.data.discussion_id;

            const participantList: Participant[] = participants.map((participant: string) => {
                return {
                    id: 0,
                    discussion_id: discussionId,
                    member_id: participant,
                };
            });
            participantList.push({
                id: 0,
                discussion_id: discussionId,
                member_id: discussion.created_by!,
            });
            const participantResp = await axios.post(`${process.env.SERVICE_DISCUSSION}/participant/addbulk`, {
                participants: participantList,
            });

            return res.status(200).send({
                message: 'Discussion created successfully',
                data: response.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Discussion creation failed!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from discussion',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    update = async (req: Request, res: Response) => {
        try {
            const discussion: Discussion = req.body.discussion;
            const response = await axios.post(`${process.env.SERVICE_DISCUSSION}/discussion/update`, {
                discussion,
            });
            return res.status(200).send({
                message: 'Discussion updated successfully',
                data: response.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Discussion update failed!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from discussion',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    updateBookmark = async (req: Request, res: Response) => {
        try {
            const discussion: UpdateBookmark = req.body.discussion;
            const response = await axios.post(`${process.env.SERVICE_DISCUSSION}/discussion/updatebookmark`, {
                discussion,
            });
            return res.status(200).send({
                message: 'Discussion bookmarked successfully',
                data: response.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Discussion bookmarked failed!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from discussion',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    updateView = async (req: Request, res: Response) => {
        try {
            const discussion_id: string = req.params.discussionId;
            const response = await axios.get(
                `${process.env.SERVICE_DISCUSSION}/discussion/updateview/${discussion_id}`
            );

            return res.status(200).send({
                message: 'Discussion view added successfully',
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Discussion view add failed!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from discussion',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    close = async (req: Request, res: Response) => {
        try {
            const discussion_id: string = req.body.discussion_id;
            const closed: boolean = req.body.closed;
            const updated_by: string = req.body.updated_by;
            const response = await axios.post(`${process.env.SERVICE_DISCUSSION}/discussion/close`, {
                discussion_id,
                closed,
                updated_by,
            });
            return res.status(200).send({
                message: 'Discussion closed successfully',
                data: response.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Discussion close failed!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from discussion',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    getDiscussionById = async (req: Request, res: Response) => {
        try {
            const discussion_id: string = req.params.discussionId;
            const response = await axios.get(`${process.env.SERVICE_DISCUSSION}/discussion/${discussion_id}`);

            return res.status(200).send({
                message: 'Discussion fetched successfully',
                data: response.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Discussion fetch failed!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from discussion',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    getTagsForDAO = async (req: Request, res: Response) => {
        try {
            const dao_id: string = req.params.daoId;
            const response = await axios.get(`${process.env.SERVICE_DISCUSSION}/discussion/gettags/${dao_id}`);

            return res.status(200).send({
                message: 'Tags fetched successfully',
                data: response.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Tags fetch failed!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from discussion',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    getDiscussionByDAO = async (req: Request, res: Response) => {
        try {
            const daoId: string = req.params.daoId;
            const empty: boolean = req.query.empty?.toString() === 'true';
            const page: string = req.query.page ? (req.query.page as string) : '1';
            const limit = 10;
            const offset = (parseInt(page) - 1) * limit;
            const discussionResult = await axios.post(`${process.env.SERVICE_DISCUSSION}/discussion/bydao/${daoId}`, {
                empty: empty,
                offset: offset,
                limit: limit,
            });

            return res.status(200).send({
                message: 'Discussion fetched successfully',
                data: discussionResult.data === null ? [] : discussionResult.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Discussion fetch failed!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from discussion',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    getDiscussionByProposal = async (req: Request, res: Response) => {
        try {
            const proposalId: string = req.params.proposalId;
            const discussionResult = await axios.get(
                `${process.env.SERVICE_DISCUSSION}/discussion/byproposal/${proposalId}`
            );

            return res.status(200).send({
                message: 'Discussion fetched successfully',
                data: discussionResult.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Discussion fetch failed!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from discussion',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    getDiscussionForMember = async (req: Request, res: Response) => {
        try {
            const memberId: string = req.params.memberId;
            const daoId: string = req.params.daoId ? req.params.daoId : '';
            // const page: string = req.query.page ? (req.query.page as string) : '1';
            // const limit = 10;
            // const offset = (parseInt(page) - 1) * limit;

            const discussionResult = await axios.post(`${process.env.SERVICE_DISCUSSION}/discussion/formember`, {
                dao_id: daoId,
                member_id: memberId,
            });

            return res.status(200).send({
                message: 'Discussion fetched successfully',
                data: discussionResult.data === null ? [] : discussionResult.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Discussion fetch failed!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from discussion',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    createMessage = async (req: Request, res: Response) => {
        try {
            const message: Message = req.body.message;
            const response = await axios.post(`${process.env.SERVICE_DISCUSSION}/message/create`, {
                message,
            });
            return res.status(200).send({
                message: 'Message created successfully',
                data: response.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Message creation failed!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from discussion',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    updateMessageContent = async (req: Request, res: Response) => {
        try {
            const message_id = req.body.messageId;
            const content = req.body.content;
            const response = await axios.post(`${process.env.SERVICE_DISCUSSION}/message/update/content`, {
                message_id,
                content
            });
            return res.status(200).send({
                message: 'Message updated successfully',
                data: response.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Message Updation failed!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while updating message content',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    deleteMessageContent = async (req: Request, res: Response) => {
        try {
            const message_id: string = req.params.messageId;
            const result = await axios.delete(`${process.env.SERVICE_DISCUSSION}/message/delete/${message_id}`);

            return res.status(200).send({
                message: 'Message Deleted successfully',
                data: result.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Message Deletion failed!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while deleting message content',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    addParticipant = async (req: Request, res: Response) => {
        try {
            const participant: Participant = req.body.participant;
            const response = await axios.post(`${process.env.SERVICE_DISCUSSION}/participant/add`, {
                participant,
            });
            return res.status(200).send({
                message: 'Participant added successfully',
                data: response.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Participant addition failed!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from discussion',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    addbulkParticipant = async (req: Request, res: Response) => {
        try {
            const participants: BulkParticipantRequest = req.body.participants;
            const participantList: Participant[] = participants.participants.map((participant: string) => {
                return {
                    id: 0,
                    discussion_id: participants.discussion_id,
                    member_id: participant,
                };
            });
            const response = await axios.post(`${process.env.SERVICE_DISCUSSION}/participant/addbulk`, {
                participants: participantList,
            });
            return res.status(200).send({
                message: 'Participants added successfully',
                data: response.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Participants addition failed!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from discussion',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    removeParticipant = async (req: Request, res: Response) => {
        try {
            const participant: Participant = req.body.participant;
            const response = await axios.post(`${process.env.SERVICE_DISCUSSION}/participant/remove`, {
                participant,
            });
            return res.status(200).send({
                message: 'Participant removed successfully',
                data: response.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Participant removal failed!',
                    error: err.response.data,
                });
            } else if (err.request) {
                return res.status(500).send({
                    message: 'Error while requesting data from discussion',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    isParticipant = async (req: Request, res: Response) => {
        try {
            const discussionId: string = req.params.discussionId;
            const memberId: string = req.params.memberId;
            const response = await axios.get(
                `${process.env.SERVICE_DISCUSSION}/participant/isparticipant/${discussionId}/${memberId}`
            );
            return res.status(200).send({
                message: 'Participant check successful',
                data: response.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Participant check failed!',
                    error: err.response.data,
                });
            } else {
                return res.status(500).send({
                    message: 'Error occurred discussion',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    getMessages = async (req: Request, res: Response) => {
        try {
            const page: string = req.query.page ? (req.query.page as string) : '1';
            const limit = 50;
            const offset = (parseInt(page) - 1) * limit;

            let messageResponse: MessageResponse[] = [];

            const response = await axios.post(`${process.env.SERVICE_DISCUSSION}/message/${req.params.discussionId}`, {
                offset,
                limit,
            });

            return res.status(200).send({
                message: 'Messages fetched successfully',
                data: response.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Messages fetch failed!',
                    error: err.response.data,
                });
            } else if (err) {
                return res.status(500).send({
                    message: 'Error while requesting data from discussion',
                    error: JSON.stringify(err),
                });
            }
        }
    };

    getParticipants = async (req: Request, res: Response) => {
        try {
            const response = await axios.get(
                `${process.env.SERVICE_DISCUSSION}/participant/${req.params.discussionId}`
            );
            return res.status(200).send({
                message: 'Participants fetched successfully',
                data: response.data,
            });
        } catch (err: any) {
            if (err.response) {
                return res.status(400).send({
                    message: 'Participants fetch failed!',
                    error: err.response.data,
                });
            } else if (err) {
                return res.status(500).send({
                    message: 'Error while requesting data from discussion',
                    error: JSON.stringify(err),
                });
            }
        }
    };
}
