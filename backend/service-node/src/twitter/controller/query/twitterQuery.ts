import { TwitterSchema } from '../../models/twitterSchema';
import { TwitterVerification } from '../../models/twitterVerifySchema';

export class TwitterQuery {
  addTwitterVerification = async (id: string, username: string, verification: boolean, twitterId: string) => {
    try {
      const result = await TwitterVerification.create({
        _id: id,
        twitter: {
          username: username,
          verification: verification,
          twitterId: twitterId,
        },
      });
      return result;
    } catch (err: any) {
      console.log(err);
    }
  };

  getTwitterVerification = async (id: string) => {
    try {
      const twitterVerification = await TwitterVerification.findOne({ '_id': id }).exec();
      return twitterVerification;
    } catch (err: any) {
      console.log(err);
    }
  };

  getTwitterVerificationByUsername = async (username: string) => {
    try {
      const twitterVerification = await TwitterVerification.findOne({ 'twitter.username': username }).exec();
      return twitterVerification;
    } catch (err: any) {
      console.log(err);
    }
  };

  addFeaturedTweet = async (linkId: string, tweet: string) => {
    try {
      const twitterExists = await TwitterSchema.findOne({ '_id': linkId }).exec();
      console.log(twitterExists);

      if (twitterExists) {
        twitterExists.twitter.push(tweet);
        const result = await twitterExists.save();
      } else {
        const newTwitter = await TwitterSchema.create({
          _id: linkId,
          twitter: [tweet],
        });
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  getFeaturedTweet = async (linkId: string) => {
    try {
      const twitter = await TwitterSchema.findOne({ _id: linkId }).exec();
      return twitter;
    } catch (err: any) {
      console.log(err);
    }
  };

  updateFeaturedTweet = async (linkId: string, tweet: string) => {
    try {
      const twitter = await TwitterSchema.findOne({ _id: linkId }).exec();
      if (twitter) {
        twitter.twitter = [tweet];
        const result = await twitter.save();
        return result;
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  deleteTweet = async ( linkId:string) => {
    try {
      const tweet = await TwitterVerification.findOneAndDelete({ _id: linkId }).exec();
      return tweet;
    } catch (err: any) {
      console.log(err);
    }
  }
}
