import mongoose from 'mongoose';
const { Schema } = mongoose;

interface IModel {
    pending_proposals: Number;
    dao_id: string;
    date: Date;
}

const proposalSchema = new Schema<IModel>(
    {
    pending_proposals: { type : 'Number', required : true },
    dao_id : { type : String, required : true },
    date : { type: Date, required: true }
    },
    {
        timeseries: {
          timeField: 'date',
          metaField: 'metadata',
          granularity: 'minutes',
        },
    }
)

const Proposal = mongoose.model<IModel>('Proposal', proposalSchema);

export { Proposal };