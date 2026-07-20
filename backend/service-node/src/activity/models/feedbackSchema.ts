import mongoose from "mongoose";
import { activityConn } from "../../db/connections";
const { Schema } = mongoose;

interface IModel {
  member_id: string;
  type_of_member: string;
  feedback: string;
  date: any;
}

const feedbackSchema = new Schema<IModel>({
  member_id: { type: String, required: true },
  type_of_member: { type: String, required: true },
  feedback: { type: String, required: true },
  date: { type: Date, required: true },
});

const FeedbackSchema = activityConn.model("Feedback", feedbackSchema);

export { FeedbackSchema };
