import mongoose from 'mongoose';

const { Schema } = mongoose;

interface IModel {
  _id: string;
  twitter: string[];
}

const twitterSchema = new Schema<IModel>({
  _id: { type: String, required: true },
  twitter: { type: [String], required: true },
});

const TwitterSchema = mongoose.model('TwitterSchema', twitterSchema);

export { TwitterSchema };
