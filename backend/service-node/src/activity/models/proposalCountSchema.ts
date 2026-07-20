import mongoose from "mongoose";
import { activityConn } from "../../db/connections";
const { Schema } = mongoose;

interface IModel {
  pending_proposals: number;
  dao_id: string;
  date: Date;
}

const proposalSchema = new Schema<IModel>(
  {
    pending_proposals: { type: "Number", required: true },
    dao_id: { type: String, required: true },
    date: { type: Date, required: true },
  },
  {
    timeseries: {
      timeField: "date",
      metaField: "metadata",
      granularity: "minutes",
    },
  },
);

const Proposal = activityConn.model<IModel>("Proposal", proposalSchema);

export { Proposal };
