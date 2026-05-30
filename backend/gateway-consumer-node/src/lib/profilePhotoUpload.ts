import aws, { PutObjectCommand, S3 } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const init = async (): Promise<any> => {
    try {
        const s3Client = new S3({
            endpoint: `https://${process.env.SPACES_ENDPOINT}`,
            region: process.env.SPACES_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SCERET_ACCESS_KEY!,
            },
        });
        return s3Client;
    } catch (err: any) {
        return err;
    }
};

const checkFileType = (file: any) => {
    const fileTypes = /jpeg|jpg|png|pdf/;

    const extensionName = fileTypes.test(file.name.toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);

    if (extensionName && mimetype) {
        return true;
    } else {
        false;
    }
};

export const upload = async (file: any) => {
    const fileId = uuidv4();
    const bucketParams = {
        Bucket: process.env.SPACES_BUCKET!,
        Key: fileId + '.' + file.name.split('.')[1],
        Body: file.data,
        ACL: 'public-read',
        ContentType: file.mimetype,
    };

    const fileCheck = checkFileType(file);
    if (fileCheck) {
        const s3Client: aws.S3 = await init();
        const result = await s3Client.send(new PutObjectCommand(bucketParams));
        const url = `https://${process.env.SPACES_CDN}/${bucketParams.Key}`;
        return url;
    }
};
