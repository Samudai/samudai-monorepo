import axios from 'axios';
import { Snapshot } from '@samudai_xyz/web3-sdk';

export class PendingProposalsController {
    pendingProposalCron = async () => {
        try{
            const result = await axios.get(`${process.env.SERVICE_DAO}/dao/getsnapshotdataforalldao`)
            const snapshotData = result.data?.data!;

            await Promise.all(snapshotData.map(async (snapshot : any, i : number)  => {
                const snap = new Snapshot(snapshot.snapshot);

                const activeVal : any = await snap.getActiveProposals();

                if(activeVal.data.proposals){
                    const res = await axios.post(`${process.env.SERVICE_ACTIVITY}/proposal/snapshot/proposal/add`, {
                        proposal : {
                            pending_proposals: activeVal.data.proposals.length,
                            dao_id : snapshot.dao_id
                        }
                    })
                }
            }))

            console.log("New Active Proposal data added for all Daos Successfully!");

        }
        catch (err: any){
            console.log("error adding new pending proposal data", err);
        }
    }
}