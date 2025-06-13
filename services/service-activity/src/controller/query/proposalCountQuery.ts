import { Proposal } from "../../models/proposalCountSchema";
import { ProposalCount } from "../../utils/types";

export class ProposalCountQuery {

    addSnapshotProposalCount = async (proposalbody : ProposalCount) => {
        try {

            const dao_id = proposalbody.dao_id;
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            // Check if there is any data with the provided dao_id
            const existingData = await Proposal.findOne({ dao_id: dao_id });

            if (!existingData) {
                const lastYear = new Date();
                lastYear.setFullYear(lastYear.getFullYear() - 1);
                lastYear.setHours(0, 0, 0, 0);

                const datesToAdd = [];
                let currentDate = new Date(lastYear);
                while (currentDate <= yesterday) {
                    datesToAdd.push(new Date(currentDate));
                    currentDate.setDate(currentDate.getDate() + 1);
                }

                const entriesToAdd = datesToAdd.map((date) => ({
                    dao_id: dao_id,
                    date: date,
                    pending_proposals: 0,
                }));

                await Proposal.insertMany(entriesToAdd);
                console.log("Added entries:", entriesToAdd);
            }

            const result = await Proposal.create(proposalbody)
            console.log(result);    
        } catch (error) {
            console.log(error);
        }
    }

    getActiveProposalsCountforDao = async (dao_id : string) => {
        try {
            const lastYear = new Date();
            lastYear.setFullYear(lastYear.getFullYear() - 1);

            const pipeline = [
                {
                    $match: {
                        dao_id: dao_id,
                        date: { $gte: lastYear },
                    },
                },
                {
                    $group: {
                        _id: { dao_id: "$dao_id", date: "$date" },
                        totalPendingProposals: { $first: "$pending_proposals" },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        date: "$_id.date",
                        value: {
                            $cond: [
                                { $gt: ["$totalPendingProposals", 0] },
                                "$totalPendingProposals",
                                0,
                            ],
                        },
                    },
                },
                {
                    $sort: { date: -1 }
                },
            ] as any;

            const result = await Proposal.aggregate(pipeline);

            console.log("answer", result);
            
            return result    
        } catch (error) {
            console.log(error);
        }
    }

}

