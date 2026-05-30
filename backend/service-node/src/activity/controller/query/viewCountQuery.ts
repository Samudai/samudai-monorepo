import { ViewCountSchema } from "../../models/viewCountSchema";
import { viewCount } from "../../utils/types";
import { LinkType } from "../../utils/enums";

export class ViewCountQuery{
    addDiscoveryView =  async (view : viewCount) => {
        try {
            const filter = { type: view.type, link_id: view.link_id, date : view.date};
            const update = { $inc: { views: 1 }, $setOnInsert: { type: view.type, link_id: view.link_id, date : view.date} };
            const options = { upsert: true, new: true, setDefaultsOnInsert: true };

            const newView = await ViewCountSchema.findOneAndUpdate(filter, update, options);
            console.log(newView);
          } catch (err: any) {
            console.log(err);
          }
    }

    mostViewedDao = async () => {
        try{
          const today = new Date();
          const date= new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
          console.log(date);

          const mostViewedDao = await ViewCountSchema.aggregate([
            { $match: { date: { $eq: date} , type: { $eq: LinkType.DAO } } },
            { $sort: { views: -1 } },
            { $limit: 1 },
            { $project: { _id: 0, link_id: 1, type: 1, views: 1 } }
          ]);

          return mostViewedDao;
        }catch (err: any) {
            console.log(err);
        }
    }

    mostViewedContributor = async () => {
      try{
        const today = new Date();
        const date= new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
        console.log(date);

        const mostViewedContributor = await ViewCountSchema.aggregate([
          { $match: { date: { $eq: date} , type: { $eq: LinkType.CONTRIBUTOR } } },
          { $sort: { views: -1 } },
          { $limit: 1 },
          { $project: { _id: 0, link_id: 1, type: 1, views: 1 } }
        ]);

        return mostViewedContributor;
      }catch (err: any) {
          console.log(err);
      }
  }
}