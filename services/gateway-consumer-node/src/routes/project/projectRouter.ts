import express, { Express, Router } from 'express';
import { CommentsController } from '../../controllers/projectController/comments';
import { ProjectController } from '../../controllers/projectController/project';
import { SubTaskController } from '../../controllers/projectController/subtask';
import { TaskController } from '../../controllers/projectController/task';
import { TaskFormResponseController } from '../../controllers/projectController/taskFormResponse';
import { PayoutController } from '../../controllers/projectController/payout';
import { manageProjectAccess, memberProjectViewAccess, viewAccess } from '../../middlewares/DAORoleAuth';
import { projectManageAccess, projectViewAccess, taskCreateAccess } from '../../middlewares/ProjectRoleAuth';
import { taskAccessAuth, taskFormResponseAccessAuth } from '../../middlewares/taskAuth';
import { requireVerifyAuth } from '../../middlewares/verifyAuth';

export class ProjectManagementRouter {
    app: Express;
    private projectRouter: Router;
    private taskRouter: Router;
    private subTaskRouter: Router;
    private commentRouter: Router;
    private taskFormResponseRouter: Router;
    private payoutRouter: Router;

    private projectController: ProjectController;
    private taskController: TaskController;
    private subtaskController: SubTaskController;
    private commentController: CommentsController;
    private taskFormResponseController: TaskFormResponseController;
    private payoutController: PayoutController;

    constructor(app: Express) {
        this.app = app;

        this.projectRouter = express.Router();
        this.projectController = new ProjectController();

        this.taskRouter = express.Router();
        this.taskController = new TaskController();

        this.subTaskRouter = express.Router();
        this.subtaskController = new SubTaskController();

        this.commentRouter = express.Router();
        this.commentController = new CommentsController();

        this.taskFormResponseRouter = express.Router();
        this.taskFormResponseController = new TaskFormResponseController();

        this.payoutRouter = express.Router();
        this.payoutController = new PayoutController();
    }

    projectManagementRouter = () => {
        //Project
        this.projectRouter.post('/create', manageProjectAccess, this.projectController.createProject);
        this.projectRouter.post('/update', projectManageAccess, this.projectController.updateProject);
        this.projectRouter.get('/getall', viewAccess, this.projectController.getAllProjects);
        this.projectRouter.get('/:projectId', projectViewAccess, this.projectController.getProjectById);

        this.projectRouter.get('/getall/:linkId', requireVerifyAuth, this.projectController.getByLinkId);

        this.projectRouter.post('/get/bymemberdao', viewAccess, this.projectController.getProjectByMemberDAO);
        this.projectRouter.post('/get/bymember', memberProjectViewAccess, this.projectController.getProjectByMember);
        this.projectRouter.delete('/delete/:projectId', projectManageAccess, this.projectController.deleteProject);
        this.projectRouter.get(
            '/contributor/:projectId',
            projectViewAccess,
            this.projectController.getContributorByProjectId
        );
        this.projectRouter.post('/update/columns', projectManageAccess, this.projectController.updateProjectColumn);
        this.projectRouter.post('/update/status', projectManageAccess, this.projectController.updateProjectCompleted);
        this.projectRouter.post(
            '/update/visibility',
            projectManageAccess,
            this.projectController.updateProjectVisibility
        );
        this.projectRouter.get('/get/workprogress/:daoId', this.projectController.getWorkprogressForDAO);
        this.projectRouter.get(
            '/invite/access/:inviteCode/:memberId',
            requireVerifyAuth,
            this.projectController.addInviteForProject
        );
        this.projectRouter.get(
            '/get/investment/:daoId',
            requireVerifyAuth,
            this.projectController.getInvestmentProjectForDAO
        );
        this.projectRouter.post('/update/pinned', requireVerifyAuth, this.projectController.updatePinnedProject);
        this.projectRouter.post('/archive', requireVerifyAuth, this.projectController.archiveProject);
        this.projectRouter.post(
            '/get/archived/bymemberdao',
            viewAccess,
            this.projectController.getArchivedProjectByMemberDAO
        );

        //Tags
        this.projectRouter.get('/list/tags', requireVerifyAuth, this.projectController.listTags);

        //Task
        this.taskRouter.post('/create', taskCreateAccess, this.taskController.createTask);
        this.taskRouter.post('/update', projectManageAccess, this.taskController.updateTask);
        this.taskRouter.post('/feedback', requireVerifyAuth, this.taskController.addFeedBack);
        this.taskRouter.get(
            '/alltask/:projectId',
            // projectViewAccess,
            requireVerifyAuth,
            this.taskController.getTaskForProject
        );
        this.taskRouter.get('/:taskId', projectViewAccess, this.taskController.getTaskById);
        this.taskRouter.delete('/delete/:taskId', projectManageAccess, this.taskController.deleteTask);
        this.taskRouter.post('/assign', projectManageAccess, this.taskController.assignTask);
        this.taskRouter.post('/update/column', taskAccessAuth, this.taskController.updateTaskColumn);
        this.taskRouter.post('/update/column/bulk', requireVerifyAuth, this.taskController.updateColumnBulk);

        // this.taskRouter.post('/review', taskReviewAuth, requireVerifyAuth, this.taskController.reviewTask);
        this.taskRouter.post('/update/position', requireVerifyAuth, this.taskController.updateTaskPosition);
        this.taskRouter.get(
            '/get/personaltask/:memberId',
            requireVerifyAuth,
            this.taskController.getMemberPersonalTask
        );
        this.taskRouter.get(
            '/get/assignedtask/:memberId',
            requireVerifyAuth,
            this.taskController.getMemberAssignedTask
        );
        this.taskRouter.post('/update/vcstatus', requireVerifyAuth, this.taskController.updateVCClaimStatus);
        this.taskRouter.post('/update/payment', manageProjectAccess, this.taskController.updateTaskPaymentStatus);
        // REDUNDANT // this.taskRouter.post('/update/payout', manageProjectAccess, this.taskController.updatePayout);
        this.taskRouter.post('/update/associatejob', this.taskController.updateTaskAssociateJob);
        this.taskRouter.post('/archivetask', manageProjectAccess, this.taskController.archiveTask);
        this.taskRouter.get(
            '/allarchivedtask/:projectId',
            requireVerifyAuth,
            this.taskController.getArchivedTaskForProject
        );

        //Subtask
        this.subTaskRouter.post('/create', taskCreateAccess, this.subtaskController.createSubtask);
        this.subTaskRouter.post('/update', projectManageAccess, this.subtaskController.updateSubtask);
        this.subTaskRouter.get('/allsubtask/:projectId', requireVerifyAuth, this.subtaskController.getAllSubtasks);
        this.subTaskRouter.get('/:subtaskId', projectViewAccess, this.subtaskController.getSubtask);
        this.subTaskRouter.delete('/:subtaskId', requireVerifyAuth, this.subtaskController.deleteSubtask);
        // REDUNDANT // this.subTaskRouter.post('/update/payout', manageProjectAccess, this.subtaskController.updatePayout);
        this.subTaskRouter.post('/update/associatejob', requireVerifyAuth, this.subtaskController.updateSubTaskAssociateJob);
        this.subTaskRouter.post('/update/status', requireVerifyAuth, this.subtaskController.updateSubTaskStatus);
        this.subTaskRouter.post('/update/column', requireVerifyAuth, this.subtaskController.updateSubTaskColumn);
        this.subTaskRouter.post(
            '/update/column/bulk',
            requireVerifyAuth,
            this.subtaskController.updateSubTaskColumnBulk
        );
        this.subTaskRouter.post('/update/position', requireVerifyAuth, this.subtaskController.updateSubtaskPosition);
        this.subTaskRouter.post('/archive', requireVerifyAuth, this.subtaskController.archiveSubtask);
        this.subTaskRouter.get(
            '/getall/archived/:projectId',
            requireVerifyAuth,
            this.subtaskController.getAllArchivedSubtask
        );

        // Payout
        this.payoutRouter.post('/create', requireVerifyAuth, this.payoutController.createPayout);
        this.payoutRouter.post('/createbulk', requireVerifyAuth, this.payoutController.createBulkPayout);
        this.payoutRouter.post('/update', requireVerifyAuth, this.payoutController.updatePayout);
        this.payoutRouter.post('/update/paymentstatus', requireVerifyAuth, this.payoutController.updatePayoutPaymentStatus);
        this.payoutRouter.post('/complete/:payoutId', requireVerifyAuth, this.payoutController.completePayout);
        this.payoutRouter.delete('/delete/:payoutId', requireVerifyAuth, this.payoutController.deletePayout);
        this.payoutRouter.get('/get/:payoutId', requireVerifyAuth, this.payoutController.getPayoutById);

        //Comments
        this.commentRouter.post('/create', requireVerifyAuth, this.commentController.createComment);
        this.commentRouter.get('/list/linkId', requireVerifyAuth, this.commentController.listComment);
        this.commentRouter.post('/update', requireVerifyAuth, this.commentController.updateComment);
        this.commentRouter.delete('/delete/:commentId', requireVerifyAuth, this.commentController.deleteComment);

        //Task Form Response
        this.taskFormResponseRouter.post(
            '/create',
            requireVerifyAuth,
            this.taskFormResponseController.createTaskFormResponse
        );
        this.taskFormResponseRouter.get(
            '/get/project/:projectId',
            requireVerifyAuth,
            this.taskFormResponseController.getAllResponseForProject
        );
        this.taskFormResponseRouter.get('/get/:responseId', this.taskFormResponseController.getTaskFormResponse);
        this.taskFormResponseRouter.post(
            '/update/column',
            taskFormResponseAccessAuth,
            this.taskFormResponseController.updateTaskFormResponseColumn
        );
        this.taskFormResponseRouter.post(
            '/update/position',
            requireVerifyAuth,
            this.taskFormResponseController.updateTaskFormResponsePosition
        );
        this.taskFormResponseRouter.post(
            '/update/column/bulk',
            requireVerifyAuth,
            this.taskFormResponseController.updateTaskFormResponseColumnBulk
        );
        this.taskFormResponseRouter.post(
            '/update/discussion',
            requireVerifyAuth,
            this.taskFormResponseController.updateTaskFormResponseDiscussion
        );
        this.taskFormResponseRouter.get(
            '/byformresponse/:formResponseId',
            requireVerifyAuth,
            this.taskFormResponseController.getTaskFormResponsebyFormResponseId
        );

        //Adding the router to the app
        this.app.use('/api/project', this.projectRouter);
        this.app.use('/api/task', this.taskRouter);
        this.app.use('/api/subtask', this.subTaskRouter);
        this.app.use('/api/payout', this.payoutRouter);
        this.app.use('/api/comment', this.commentRouter);
        this.app.use('/api/taskformresponse', this.taskFormResponseRouter);
    };
}
