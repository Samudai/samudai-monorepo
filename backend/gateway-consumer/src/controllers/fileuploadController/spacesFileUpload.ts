import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { UploadSuccess } from '../../lib/helper/Responsehandler';
import { uploadFileToSpaces } from '../../lib/spacesFileUpload';

export class SpacesFileUploadController {
    uploadFile = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let file;
            if (req.files) {
                file = req.files.file;

                const result = await uploadFileToSpaces(file);

                new UploadSuccess(res, 'File', result);
            } else {
                return res.status(404).send({
                    message: 'No File Found',
                    data: null,
                });
            }
        } catch (err: any) {
            next(new ErrorException(err, 'Error while uploading file to spaces'));
        }
    };
}
