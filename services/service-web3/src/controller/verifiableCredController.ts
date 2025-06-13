import { Request, Response } from 'express';
import { VerifiableCredQuery } from './query/verifiableCreds';

export class VerifiableCredController {
  verifiableCredQuery: VerifiableCredQuery;

  constructor() {
    this.verifiableCredQuery = new VerifiableCredQuery();
  }

  addVerifiableCred = async (req: Request, res: Response) => {
    try {
      const member_id: string = req.body.member_id;
      const did: string = req.body.did;
      const stream_id: string = req.body.stream_id;
      const verifiableCredential: any = req.body.verifiableCredential;
      const result = await this.verifiableCredQuery.addVerifiableCred(member_id, did, stream_id, verifiableCredential);
      res.status(201).json({ message: 'Verifiable Credential creating Successfully', data: result });
    } catch (err: any) {
      if (err.response) {
        return res
          .status(err.response.status)
          .send({ message: 'Could not create verifiable credential', error: err.response.data.err });
      } else {
        return res.status(500).send({ message: 'Error creating verifiable credential', error: err });
      }
    }
  };

  getVerifiableCred = async (req: Request, res: Response) => {
    try {
      const member_id: string = req.params.memberId;
      const result = await this.verifiableCredQuery.getVerifiableCred(member_id);
      res.status(200).json({ message: 'Verifiable Credential fetched Successfully', data: result });
    } catch (err: any) {
      if (err.response) {
        return res
          .status(err.response.status)
          .send({ message: 'Could not fetch verifiable credential', error: err.response.data.err });
      } else {
        return res.status(500).send({ message: 'Error fetching verifiable credential', error: err });
      }
    }
  };
}
