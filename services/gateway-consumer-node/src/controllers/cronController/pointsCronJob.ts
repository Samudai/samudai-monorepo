import axios from 'axios';
import { CronEnums } from '@samudai_xyz/gateway-consumer-types';

export class PointCronController {
    guildMetricCron = async () => {
        try {
            const result = await axios.get(`${process.env.SERVICE_DISCORD}/point/discord/addMetric`);
            if (result) {
                console.log('Guild Metric added Successfully!');
            }
        } catch (err: any) {
            console.log('error adding guild metric', err);
        }
    };
    removeDuplicateCron = async () => {
        try {
            const result = await axios.get(`${process.env.SERVICE_DISCORD}/point/discord/removeDuplicate`);
            if (result) {
                console.log('Removed Duplicate Data Successfully!');
            }
        } catch (err: any) {
            console.log('error removing  duplicate data', err);
        }
    };
}
