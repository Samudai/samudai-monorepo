import { Request, Response } from 'express';
import { Twitter } from '../lib/twitter';
import { handleVerify } from '../lib/verification';
import { TwitterQuery } from './query/twitterQuery';

export class VerifyController {
  twitter = new Twitter();
  twitterDBQuery = new TwitterQuery();

  verify = async (req: Request, res: Response) => {
    try {
      let verified: boolean = false;
      let responseMessage: string = '';
      const id: string = req.body.id;
      const username: string = req.body.username;
      const address: string = req.body.address;
      const user = await this.twitter.getUser(username);

      const userId = user?.data?.id;

      if (userId) {
        const res = await this.twitter.getRecentLastTweet(userId);
        console.log(res);
        const tweetBody = res?.data?.[0]?.text;
        const signatureAccount = await handleVerify(username, tweetBody as string);
        if (signatureAccount === address) {
          verified = true;
          responseMessage = 'Signature verified';
        } else {
          verified = false;
          responseMessage = 'Signature not verified';
        }
      } else {
        verified = false;
        responseMessage = 'User not found';
      }

      const check = await this.twitterDBQuery.getTwitterVerificationByUsername(username);
      if (!!check) {
        return res.status(400).send({
          message: 'Twitter profile already verified',
          data: null,
        });
      }

      const result = await this.twitterDBQuery.addTwitterVerification(id, username, verified, userId!);
      res.status(200).send({
        message: responseMessage,
        data: {
          verified: verified,
          username: username,
        },
      });
    } catch (err: any) {
      console.log(err);
      if (err.response) {
        return res
          .status(err.response.status)
          .send({ message: 'Could not verify signature', error: err.response.data });
      } else {
        return res.status(500).send({ message: 'Error verifying signature', error: err });
      }
    }
  };

  getVerified = async (req: Request, res: Response) => {
    try {
      const id: string = req.params.id;
      const result = await this.twitterDBQuery.getTwitterVerification(id);
      res.status(200).send({
        message: 'Verified retrieved successfully',
        data: result,
      });
    } catch (err: any) {
      if (err.response) {
        return res.status(err.response.status).send({ message: 'Could not get verified', error: err.response.data });
      } else {
        return res.status(500).send({ message: 'Error getting verified', error: err });
      }
    }
  };

  getByUsername = async (req: Request, res: Response) => {
    try {
      const username: string = req.params.username;
      const result = await this.twitterDBQuery.getTwitterVerificationByUsername(username);
      res.status(200).send({
        message: 'Verified retrieved successfully',
        data: result,
      });
    } catch (err: any) {
      if (err.response) {
        return res.status(err.response.status).send({ message: 'Could not get verified', error: err.response.data });
      } else {
        return res.status(500).send({ message: 'Error getting verified', error: err });
      }
    }
  };
}
