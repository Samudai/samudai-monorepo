import { ActivitySchema } from '../../models/activitySchema';


export class mostActiveQuery{
    mostActiveDao = async () => {
        try {
            const mostActiveDAO = await ActivitySchema.aggregate([
              {
                $match: {
                  timestamp_property: {
                    $gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                  }
                }
              },
              {
                $group: {
                  _id: "$dao_id",
                  count: { $sum: 1 }
                }
              },
              {
                $match: {
                  _id: { $ne: null }
                }
              },
              {
                $sort: { count: -1 }
              },
              {
                $limit: 1
              },
              {
                $project: {
                  dao_id: "$_id",
                  count: 1,
                  _id: 0
                }
              }
            ]);
              return mostActiveDAO;
        }
        catch (err) {
            console.log(err);
        }
    }

    mostActiveContributor = async () => {
        try {
            const mostActiveContributor = await ActivitySchema.aggregate([
              {
                $match: {
                  timestamp_property: {
                    $gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                  }
                }
              },
              {
                $group: {
                  _id: "$member_id",
                  count: { $sum: 1 }
                }
              },
              {
                $match: {
                  _id: { $ne: null }
                }
              },
              {
                $sort: { count: -1 }
              },
              {
                $limit: 1
              },
              {
                $project: {
                  member_id: "$_id",
                  count: 1,
                  _id: 0
                }
              }
            ]);
              return mostActiveContributor;
        }
        catch (err) {
            console.log(err);
        }
    }
}