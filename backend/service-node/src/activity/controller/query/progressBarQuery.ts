import { ContributorProgressBar, DaoProgressBar } from '../../models/progressBarSchema';
import { ContributorItems, DAOItems } from '../../utils/types';

export class ProgressBarQuery {
  updateDAOProgressBar = async (daoId: string, itemIds: string[]) => {
    try {
      const exists = await DaoProgressBar.findOne({ dao_id: daoId });
      if (exists) {
        const itemsUpdate: any = {};
        itemIds.forEach((itemId) => {
          itemsUpdate[`items.${itemId}`] = true;
        });
        const update = { $set: itemsUpdate };
        const updatedDaoPGBar = await DaoProgressBar.findOneAndUpdate({ dao_id: daoId }, update, { new: true });
        console.log(`Updated DAO ProgressBar document with ID ${daoId}:`, updatedDaoPGBar);
        return updatedDaoPGBar;
      } else {
        const itemsDefault: DAOItems = {
          setup_dao_profile: false,
          complete_integrations: false,
          create_a_project: false,
          claim_subdomain: false,
          connect_discord: false,
          connect_safe: false,
          connect_snapshot: false,
          // complete_profile: false,
          // explore_dashboard: false,
          // invite_members: false,
          // start_new_project: false,
          // post_a_job: false,
          // collaboration_pass_claim: false
        };

        const newDaoPGBar = new DaoProgressBar({
          dao_id: daoId,
          items: itemsDefault,
        });
        const savedDaoPGBar = await newDaoPGBar.save();

        const updatedItems:any = { ...itemsDefault };

        itemIds.forEach(itemId => {
          updatedItems[itemId] = true;
        });
        
        savedDaoPGBar.items = updatedItems;
        const updatedDaoPGBar = await savedDaoPGBar.save();
        return updatedDaoPGBar;
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  getDAOProgressBar = async (daoId: string) => {
    try {
      const daoProgressBar = await DaoProgressBar.findOne({ dao_id: daoId }).exec();
      return daoProgressBar;
    } catch (err: any) {
      console.log(err);
    }
  };

  updateContributorProgressBar = async (memberId: string, itemIds: string[]) => {
    try {
      const exists = await ContributorProgressBar.findOne({ member_id: memberId });
      if (exists) {
        const itemsUpdate: any = {};
        itemIds.forEach((itemId) => {
          itemsUpdate[`items.${itemId}`] = true;
        });
        console.log('itemsUpdate', itemsUpdate);
        
        const update = { $set: itemsUpdate };
        const updatedContributorPGBar = await ContributorProgressBar.findOneAndUpdate({ member_id: memberId }, update, {
          new: true,
        });
        console.log(`Updated Contributor ProgressBar document with ID ${memberId}:`, updatedContributorPGBar);
        return updatedContributorPGBar;
      } else {
        const itemsDefault: ContributorItems = {
          open_to_work: false,
          add_techstack: false,
          featured_projects: false,
          add_hourly_rate: false,
          accept_pending_requests: false,
          connect_telegram: false,
          claim_subdomain: false,
          claim_nft: false,
          connect_discord: false,
          //   complete_profile: false,
          //   invite_members: false,
          //   connect_with_contributors: false,
          //   apply_for_job: false,
          //   nft_claim: false,
        };

        const newContributorPGBar = new ContributorProgressBar({
          member_id: memberId,
          items: itemsDefault,
        });
        const savedContributorPGBar = await newContributorPGBar.save();

        const updatedItems:any = { ...itemsDefault };

        itemIds.forEach(itemId => {
          updatedItems[itemId] = true;
        });
        savedContributorPGBar.items = updatedItems;
        const updatedContributorPGBar = await savedContributorPGBar.save();
        return updatedContributorPGBar;
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  getContributorProgressBar = async (memberId: string) => {
    try {
      const contributorProgressBar = await ContributorProgressBar.findOne({ member_id: memberId }).exec();
      return contributorProgressBar;
    } catch (err: any) {
      console.log(err);
    }
  };
}
