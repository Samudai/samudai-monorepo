import mongoose from 'mongoose';
import { LinkType } from '../utils/enums';
const { Schema } = mongoose;

interface IModel {
    type : LinkType;
    link_id : string;
    views : number;
    date: Date;
}

const viewCountSchema = new Schema<IModel>({
    type : { 
      type : String, 
      required : true
    },
    link_id: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    views: {
      type: Number,
      required: true,
      default: 1,
    },
  });
  
const ViewCountSchema = mongoose.model('DiscoveryView', viewCountSchema);

export { ViewCountSchema };