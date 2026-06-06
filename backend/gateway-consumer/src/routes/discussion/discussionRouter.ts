import express, { Express, Router } from 'express';
import { DiscussionController } from '../../controllers/discussionController/discussion';
import { requireVerifyAuth } from '../../middlewares/verifyAuth';

export class DiscussionRouter {
    app: Express;
    private router: Router;
    private discussionController: DiscussionController;

    constructor(app: Express) {
        this.app = app;
        this.router = express.Router();
        this.discussionController = new DiscussionController();
    }

    discussionRouter = () => {
        this.router.post('/create', requireVerifyAuth, this.discussionController.create);
        this.router.post('/update', requireVerifyAuth, this.discussionController.update);
        this.router.post('/updatebookmark', requireVerifyAuth, this.discussionController.updateBookmark);
        this.router.get('/updateview/:discussionId', requireVerifyAuth, this.discussionController.updateView);
        this.router.post('/close', requireVerifyAuth, this.discussionController.close);
        this.router.get('/get/:discussionId', requireVerifyAuth, this.discussionController.getDiscussionById);
        this.router.get('/getall/:daoId', requireVerifyAuth, this.discussionController.getDiscussionByDAO);
        this.router.get(
            '/byproposal/:proposalId',
            requireVerifyAuth,
            this.discussionController.getDiscussionByProposal
        );
        this.router.get('/getfor/:memberId/:daoId', requireVerifyAuth, this.discussionController.getDiscussionForMember);
        this.router.get('/gettags/:daoId', requireVerifyAuth, this.discussionController.getTagsForDAO);

        this.router.post('/message/create', requireVerifyAuth, this.discussionController.createMessage);
        this.router.post('/message/update/content', requireVerifyAuth, this.discussionController.updateMessageContent);
        this.router.delete('/message/delete/:messageId', requireVerifyAuth, this.discussionController.deleteMessageContent);
        this.router.get('/message/:discussionId', requireVerifyAuth, this.discussionController.getMessages);

        this.router.post('/participant/add', requireVerifyAuth, this.discussionController.addParticipant);
        this.router.post('/participant/addbulk', requireVerifyAuth, this.discussionController.addbulkParticipant);
        this.router.post('/participant/remove', requireVerifyAuth, this.discussionController.removeParticipant);
        this.router.get(
            '/isparticipant/:discussionId/:memberId',
            requireVerifyAuth,
            this.discussionController.isParticipant
        );
        this.router.get('/participant/:discussionId', requireVerifyAuth, this.discussionController.getParticipants);

        this.app.use('/api/discussion', this.router);
    };
}
