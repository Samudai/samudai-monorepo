import mongoose from 'mongoose';
const { Schema } = mongoose;

interface IModel {
  dao_id: string;
  accessControlConditions: [
    {
      contractAddress: string;
      standardContractType: string;
      chain: string;
      method: string;
      parameters: string[];
      returnValueTest: {
        comparator: string;
        value: string;
      };
    }
  ];
  resourceId: {
    baseUrl: string;
    path: string;
    orgId: string;
    role: string;
    extraData: string;
  };
}

const tokenGatingSchema = new Schema<IModel>({
  dao_id: { type: String, required: true },
  accessControlConditions: [
    {
      contractAddress: { type: String, required: false },
      standardContractType: { type: String, required: false },
      chain: { type: String, required: true },
      method: { type: String, required: true },
      parameters: { type: Array, required: true },
      returnValueTest: {
        comparator: { type: String, required: true },
        value: { type: String, required: true },
      },
    },
  ],
  resourceId: {
    baseUrl: { type: String, required: true },
    path: { type: String, required: true },
    orgId: { type: String, required: true },
    role: { type: String, required: false },
    extraData: { type: String, required: false },
  },
});

const TokenGating = mongoose.model('TokenGating', tokenGatingSchema);

export { TokenGating };
