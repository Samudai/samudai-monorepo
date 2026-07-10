import { CreateBucketCommandOutput, S3Client } from '@aws-sdk/client-s3';
import { PartialUserObjectResponse } from './notionApiEndpoint';

export type AWSInit = {
    s3Client: S3Client;
    data: CreateBucketCommandOutput;
};

export type AuthResponse = {
    access_token: string;
    token_type: string;
    bot_id: string;
    workspace_name: string;
    workspace_icon: string;
    workspace_id: string;
    owner: PartialUserObjectResponse;
};
