import axios from 'axios';
import { CronEnums } from '@samudai_xyz/gateway-consumer-types';

export class MostActiveController {
    mostActiveDAOCron = async () => {
        try {
            const result = await axios.get(`${process.env.SERVICE_ACTIVITY}/mostactive/dao`);
            const mostActive = result.data?.dao!;
            console.log(result.data.dao.dao_id);

            if (result.data) {
                const res = await axios.post(`${process.env.SERVICE_ACTIVITY}/engagement/mostactive/add`, {
                    most_active: {
                        type: CronEnums.LinkType.DAO,
                        link_id: mostActive.dao_id,
                        count: mostActive.count,
                    },
                });

                if (res) {
                    console.log('New Most Active data added Successfully!');
                }
            }
        } catch (err: any) {
            console.log('error adding new most active data', err);
        }
    };

    mostActiveContributorCron = async () => {
        try {
            const result = await axios.get(`${process.env.SERVICE_ACTIVITY}/mostactive/contributor`);
            const mostActive = result.data?.contributor!;
            console.log(result.data.contributor.member_id);

            if (result.data) {
                const res = await axios.post(`${process.env.SERVICE_ACTIVITY}/engagement/mostactive/add`, {
                    most_active: {
                        type: CronEnums.LinkType.CONTRIBUTOR,
                        link_id: mostActive.member_id,
                        count: mostActive.count,
                    },
                });

                if (res) {
                    console.log('New Most Active data added Successfully!');
                }
            }
        } catch (err: any) {
            console.log('error adding new most active data', err);
        }
    };
}
