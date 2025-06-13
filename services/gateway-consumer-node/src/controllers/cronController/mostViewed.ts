import axios from 'axios';
import { CronEnums } from '@samudai_xyz/gateway-consumer-types';

export class MostViewedController {
    mostViewedDAOCron = async () => {
        try {
            const result = await axios.get(`${process.env.SERVICE_ACTIVITY}/viewcount/mostviewed/dao`);
            const mostViewed = result.data?.dao!;
            console.log(result.data.dao);

            if (result.data) {
                const res = await axios.post(`${process.env.SERVICE_ACTIVITY}/engagement/mostviewed/add`, {
                    most_viewed: {
                        type: CronEnums.LinkType.DAO,
                        link_id: mostViewed.link_id,
                        views: mostViewed.views,
                    },
                });
                if (res) {
                    console.log('New Most Viewed data added Successfully!');
                }
            }
        } catch (err: any) {
            console.log('error adding new most viewed data', err);
        }
    };

    mostViewedContributorCron = async () => {
        try {
            const result = await axios.get(`${process.env.SERVICE_ACTIVITY}/viewcount/mostviewed/contributor`);
            const mostActive = result.data?.contributor!;
            console.log(result.data.contributor);

            if (result.data) {
                const res = await axios.post(`${process.env.SERVICE_ACTIVITY}/engagement/mostviewed/add`, {
                    most_viewed: {
                        type: CronEnums.LinkType.CONTRIBUTOR,
                        link_id: mostActive.link_id,
                        views: mostActive.views,
                    },
                });

                if (res) {
                    console.log('New Most Viewed data added Successfully!');
                }
            }
        } catch (err: any) {
            console.log('error adding new most viewed data', err);
        }
    };
}
