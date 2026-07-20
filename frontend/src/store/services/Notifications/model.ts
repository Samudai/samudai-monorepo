import { WebNotification } from '@samudai/gateway-consumer-types';

export interface notificationResponse {
    error?: any;
    message: string;
    data?: WebNotification[];
}
