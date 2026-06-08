import mongoose from "mongoose";
import { activityConn } from "../../db/connections";
import { LinkType } from "../utils/enums";
const { Schema } = mongoose;

interface IModel {
  type: LinkType;
  link_id: string;
  count: number;
  timestamp_property: any;
}

const mostActiveSchema = new Schema<IModel>(
  {
    type: { type: String, required: true },
    link_id: { type: String, required: true },
    count: { type: Number, required: true },
    timestamp_property: { type: Date, required: true },
  },
  {
    timeseries: {
      timeField: "timestamp_property",
      metaField: "metadata",
      granularity: "minutes",
    },
  },
);

const MostActiveSchema = activityConn.model("MostActive", mostActiveSchema);

interface IModelMostViewed {
  type: LinkType;
  link_id: string;
  views: number;
  date: any;
}

const mostViewedSchema = new Schema<IModelMostViewed>(
  {
    type: { type: String, required: true },
    link_id: { type: String, required: true },
    views: { type: Number, required: true },
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

const MostViewedSchema = activityConn.model("MostViewed", mostViewedSchema);

export { MostActiveSchema, MostViewedSchema };
