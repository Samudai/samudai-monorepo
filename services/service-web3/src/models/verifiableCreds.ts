import mongoose from 'mongoose';

const { Schema } = mongoose;

interface IModel {
  member_id: string;
  did: string;
  stream_id: string;
  verifiableCredential: [
    {
      issuanceDate: string;
      badges: [
        {
          provider: string; //DAO Name
          badgePhoto: string;
          credential: {
            type: ['VerifiableCredential'];
            proof: {
              jws: string;
              created: string; //Timestamp
              proofPurpose: 'assertionMethod';
            };
            issuer: 'Samudai';
            '@context': ['https://www.w3.org/2018/credentials/v1'];
            issuanceDate: string; //DATE
            credentialSubject: {
              task: string;
              project: string;
              bounty: string;
              Clan: string; //empty
              skill: string[]; //tags
              timeSpent: string; //''
              '@context': [
                {
                  hash: 'https://schema.org/Text';
                  provider: 'https://schema.org/Text';
                }
              ];
            };
          };
        }
      ];
    }
  ];
}

const verifiableCredSchema = new Schema<IModel>({
  member_id: { type: String, required: true },
  did: { type: String, required: true },
  stream_id: { type: String, required: true },
  verifiableCredential: [
    {
      issuanceDate: { type: String, required: true },
      badges: [
        {
          provider: { type: String, required: true },
          badgePhoto: { type: String },
          credential: {
            type: { type: Array, required: true },
            proof: {
              jws: { type: String, required: true },
              created: { type: String, required: true },
              proofPurpose: { type: String, required: true },
            },
            issuer: { type: String, required: true },
            '@context': { type: Array, required: true },
            issuanceDate: { type: String, required: true },
            credentialSubject: {
              task: { type: String, required: true },
              project: { type: String, required: true },
              bounty: { type: String },
              Clan: { type: String },
              skill: { type: Array },
              timeSpent: { type: String },
              '@context': { type: Array, required: true },
            },
          },
        },
      ],
    },
  ],
});

const VerifiableCred = mongoose.model('VerifiableCred', verifiableCredSchema);

export { VerifiableCred };
