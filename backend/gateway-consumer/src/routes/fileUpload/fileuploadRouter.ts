import express, { Express, Router } from 'express';
import { SpacesFileUploadController } from '../../controllers/fileuploadController/spacesFileUpload';
import { FileController } from '../../controllers/projectController/fileUpload';
import { requireVerifyAuth } from '../../middlewares/verifyAuth';

export class UploadRouter {
    app: Express;
    private router: Router;
    private uploadController: FileController;
    private spacesFileUploadController: SpacesFileUploadController;

    constructor(app: Express) {
        this.app = app;
        this.router = express.Router();
        this.uploadController = new FileController();
        this.spacesFileUploadController = new SpacesFileUploadController();
    }

    uploadRouter = () => {
        //Folder structure
        this.router.post('/folder/create', requireVerifyAuth, this.uploadController.createProjectFolders);
        this.router.get('/folder/:folderId', requireVerifyAuth, this.uploadController.getProjectFolderById);
        this.router.get('/folder/byproject/:projectId', requireVerifyAuth, this.uploadController.getProjectFileFolders);
        this.router.put('/folder/update', requireVerifyAuth, this.uploadController.updateProjectFolder);
        this.router.delete('/folder/delete/:folderId', requireVerifyAuth, this.uploadController.deleteProjectFolder);

        //File uploads
        this.router.post('/file/upload/project', requireVerifyAuth, this.uploadController.uploadProjectFile);
        this.router.post('/file/upload/task', requireVerifyAuth, this.uploadController.uploadTaskFile);
        this.router.get('/file/get/project/:folderId', requireVerifyAuth, this.uploadController.getProjectFileFolders);
        this.router.get('/file/get/task/:taskId', requireVerifyAuth, this.uploadController.getTaskFile);
        this.router.delete(
            '/file/delete/project/:projectFileId',
            requireVerifyAuth,
            this.uploadController.deleteProjectFile
        );
        this.router.delete('/file/delete/task/:taskFileId', requireVerifyAuth, this.uploadController.deleteTaskFile);

        //spaces file upload
        this.router.post('/upload/spaces', requireVerifyAuth, this.spacesFileUploadController.uploadFile);

        this.app.use('/api', this.router);
    };
}
