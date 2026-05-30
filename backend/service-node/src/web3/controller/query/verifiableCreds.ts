import axios from 'axios';
import { VerifiableCred } from '../../models/verifiableCreds';

export class VerifiableCredQuery {
  addVerifiableCred = async (member_id: string, did: string, stream_id: string, verifiableCredential: any) => {
    try {
      const exists = await VerifiableCred.findOne({ member_id: member_id });
      if (exists) {
        exists.verifiableCredential.push(verifiableCredential);
        await exists.save();

        const memberEvent = {
          member_id: member_id,
          event_type: 'verifyable_creds_updated',
          event_context: 'verify_creds',
        };

        const eventResult = await axios.post(`${process.env.SERVICE_DISCOVERY}/events/member/create`, {
          event: memberEvent,
        });
      } else {
        const newVerifiableCred = await VerifiableCred.create({
          member_id: member_id,
          did: did,
          stream_id: stream_id,
          verifiableCredential: [verifiableCredential],
        });

        const memberEvent = {
          member_id: member_id,
          event_type: 'verifyable_creds_created',
          event_context: 'verify_creds',
        };

        const eventResult = await axios.post(`${process.env.SERVICE_DISCOVERY}/events/member/create`, {
          event: memberEvent,
        });
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  getVerifiableCred = async (member_id: string) => {
    try {
      const verifiableCred = await VerifiableCred.findOne({ member_id: member_id }).exec();
      return verifiableCred;
    } catch (err) {
      console.log(err);
    }
  };
}
