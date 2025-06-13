import mongoose from 'mongoose';
const { Schema } = mongoose;

// Updated with latest changes
interface IModel {
  dao_id?: string;
  member_id: string;
  project_id?: string;
  task_id?: string;
  subtask_id?: string;
  discussion_id?: string;
  job_id?: string;
  payment_id?: string;
  bounty_id?: string;
  action_type: string;
  visibility: string;
  member: {
    username: string;
    profile_picture: string;
  };
  dao: {
    dao_name: string;
    profile_picture: string;
  };
  project?: {
    project_name: string;
  };
  task?: {
    task_name: string;
  };
  subtask?: {
    subtask_name: string;
  };
  action: {
    message: string;
  };
  metadata?: {
    [key: string]: any;
  };
  timestamp_property: any;
}

const activitySchema = new Schema<IModel>(
  {
    dao_id: { type: String },
    member_id: { type: String, required: true },
    project_id: { type: String },
    task_id: { type: String },
    subtask_id: { type: String },
    discussion_id: { type: String },
    job_id: { type: String },
    payment_id: { type: String },
    bounty_id: { type: String },
    action_type: { type: String, required: true },
    visibility: { type: String, required: true },
    member: {
      username: { type: String, required: true },
      profile_picture: { type: String },
    },
    dao: {
      dao_name: { type: String, required: true },
      profile_picture: { type: String },
    },
    project: {
      project_name: { type: String },
    },
    task: {
      task_name: { type: String },
    },
    subtask: {
      subtask_name: { type: String },
    },
    action: {
      message: { type: String, required: true },
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    timestamp_property: { type: Date, required: true },
  },
  {
    timeseries: {
      timeField: 'timestamp_property',
      metaField: 'metadata',
      granularity: 'minutes',
    },
  }
);

const ActivitySchema = mongoose.model('Activity', activitySchema);

export { ActivitySchema };
