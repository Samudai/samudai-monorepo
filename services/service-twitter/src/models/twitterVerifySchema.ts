import mongoose from 'mongoose';
const { Schema } = mongoose;

interface IModel {
  _id: string;
  twitter: {
    username: string;
    verification: boolean;
    twitterId: string;
  };
}

const twitterVerificationSchema = new Schema<IModel>({
  _id: { type: String, required: true },
  twitter: {
    username: { type: String, required: true },
    verification: { type: Boolean, required: true },
    twitterId: { type: String, required: true },
  },
});

const TwitterVerification = mongoose.model('TwitterVerification', twitterVerificationSchema);

export { TwitterVerification };
