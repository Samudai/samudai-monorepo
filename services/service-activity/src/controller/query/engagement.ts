import { MostActiveSchema , MostViewedSchema } from '../../models/engagementSchema';
import { MostActive, viewCount } from '../../utils/types';
import { LinkType } from '../../utils/enums';

export class EngagementQuery{
    // Most Active
    addMostActive = async (most_active : MostActive) => {
        try {
            const newMostActive = await MostActiveSchema.create(most_active);
            console.log(newMostActive);
          } catch (err: any) {
            console.log(err);
          }
    }

    getMostActiveDAO = async () => {
        try{
            const today = new Date();
            today.setUTCHours(0, 0, 0, 0);;
            const yesterday = new Date(today.getTime() - (24 * 60 * 60 * 1000));
            
            const mostActiveDAO = await MostActiveSchema.findOne({
                type: LinkType.DAO,
                timestamp_property: {
                  $gte: yesterday,
                  $lt: today
                }
            });
            return mostActiveDAO;
        }
        catch (err: any) {
            console.log(err);
        }
    }

    getMostActiveContributor = async () => {
        try{
            const today = new Date();
            today.setUTCHours(0, 0, 0, 0);;
            const yesterday = new Date(today.getTime() - (24 * 60 * 60 * 1000));
            
            const mostActiveDAO = await MostActiveSchema.findOne({
                type: LinkType.CONTRIBUTOR,
                timestamp_property: {
                  $gte: yesterday,
                  $lt: today
                }
            });
            return mostActiveDAO;
        }
        catch (err: any) {
            console.log(err);
        }
    }

    // Most Viewed 

    addMostViewed = async (most_viewed : viewCount) => {
        try {
            const newMostViewed = await MostViewedSchema.create(most_viewed);
            console.log(newMostViewed);
          } catch (err: any) {
            console.log(err);
          }
    }

    getMostViewedDAO = async () => {
        try{
            const today = new Date();
            today.setUTCHours(0, 0, 0, 0);;
            const yesterday = new Date(today.getTime() - (24 * 60 * 60 * 1000));
            
            const mostViewedDAO = await MostViewedSchema.findOne({
                type: LinkType.DAO,
                date: {
                  $eq: yesterday,
                }
            });
            return mostViewedDAO;
        }
        catch (err: any) {
            console.log(err);
        }
    }

    getMostViewedContributor = async () => {
        try{
            const today = new Date();
            today.setUTCHours(0, 0, 0, 0);;
            const yesterday = new Date(today.getTime() - (24 * 60 * 60 * 1000));
            
            const mostViewedContributor = await MostViewedSchema.findOne({
                type: LinkType.CONTRIBUTOR,
                  date: {
                  $eq: yesterday,
                }
            });
            return mostViewedContributor;
        }
        catch (err: any) {
            console.log(err);
        }
    }
    
}