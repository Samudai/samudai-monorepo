import mongoose from 'mongoose';
import { TokenGating } from '../../models/tokenGating';
import { AccessControlConditions, ResourceId } from '../../utils/types';

export class TokenGatingQuery {
  addTokenGating = async (dao_id: string, accessControlConditions: AccessControlConditions, resourceId: ResourceId) => {
    try {
      const newTokenGating = await TokenGating.create({
        dao_id: dao_id,
        accessControlConditions: [accessControlConditions],
        resourceId: resourceId,
      });
      return newTokenGating;
    } catch (err: any) {
      console.log(err);
    }
  };

  getTokenGating = async (dao_id: string) => {
    try {
      const tokenGating = await TokenGating.findOne(
        { dao_id: dao_id },
        { _id: 0, dao_id: 1, accessControlConditions: 1, resourceId: 1 }
      ).exec();
      return tokenGating;
    } catch (err: any) {
      console.log(err);
    }
  };

  deleteTokenGating = async (dao_id: string) => {
    try {
      await TokenGating.deleteOne({ dao_id: dao_id });
    } catch (err: any) {
      console.log(err);
    }
  };
}
