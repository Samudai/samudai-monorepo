import { WebNotification } from '@samudai_xyz/gateway-consumer-types';

export interface notificationResponse {
    error?: any;
    message: string;
    data?: WebNotification[];
}
