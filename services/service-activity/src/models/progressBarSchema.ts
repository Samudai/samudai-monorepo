import mongoose from 'mongoose';
import { ContributorItems, DAOItems } from '../utils/types';
const { Schema } = mongoose;

interface IModelDAO {
  dao_id: string;
  items: DAOItems;
}

// const DaoPGBarSchema = new mongoose.Schema<IModelDAO>({
//     dao_id: {
//       type: String,
//       required: true
//     },
//     items: {
//       complete_profile: {
//         type: Boolean
//       },
//       explore_dashboard: {
//         type: Boolean
//       },
//       invite_members: {
//         type: Boolean
//       },
//       start_new_project: {
//         type: Boolean
//       },
//       post_a_job: {
//         type: Boolean
//       },
//       collaboration_pass_claim : {
//         type: Boolean
//       }
//     }
// });

const DaoPGBarSchema = new mongoose.Schema<IModelDAO>({
  dao_id: {
    type: String,
    required: true,
  },
  items: {
    setup_dao_profile: {
      type: Boolean,
    },
    complete_integrations: {
      type: Boolean,
    },
    create_a_project: {
      type: Boolean,
    },
    claim_subdomain: {
      type: Boolean,
    },
    connect_discord: {
      text: Boolean,
    },
    connect_safe: {
      text: Boolean,
    },
    connect_snapshot: {
      text: Boolean,
    }
  },
});

const DaoProgressBar = mongoose.model('DaoProgressBar', DaoPGBarSchema);

interface IModelContributor {
  member_id: string;
  items: ContributorItems;
}

// const ContributorPGBarSchema = new mongoose.Schema<IModelContributor>({
//   member_id: {
//     type: String,
//     required: true,
//   },
//   items: {
//     complete_profile: {
//       type: Boolean,
//     },
//     invite_members: {
//       type: Boolean,
//     },
//     connect_with_contributors: {
//       type: Boolean,
//     },
//     apply_for_job: {
//       type: Boolean,
//     },
//     nft_claim: {
//       type: Boolean,
//     },
//   },
// });

const ContributorPGBarSchema = new mongoose.Schema<IModelContributor>({
  member_id: {
    type: String,
    required: true,
  },
  items: {
    open_to_work: {
      type: Boolean,
    },
    add_techstack: {
      type: Boolean,
    },
    featured_projects: {
      type: Boolean,
    },
    add_hourly_rate: {
      type: Boolean,
    },
    accept_pending_requests: {
      type: Boolean,
    },
    connect_telegram: {
      type: Boolean,
    },
    claim_subdomain: {
      type: Boolean,
    },
    claim_nft: {
      text: Boolean,
    },
    connect_discord: {
      text: Boolean,
    },
  },
});

const ContributorProgressBar = mongoose.model('ContributorProgressBar', ContributorPGBarSchema);

export { ContributorProgressBar, DaoProgressBar };
