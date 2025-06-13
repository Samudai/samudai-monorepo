import mongoose from 'mongoose';

const { Schema } = mongoose;

interface IModel {
  _id: string;
  member_type: string;
  steps: [
    {
      step_id: string;
      completed: boolean;
      value: [Object];
    }
  ];
  expireAt: Date;
}

const onboardingSchema = new Schema<IModel>({
  _id: { type: String, required: true },
  member_type: { type: String },
  steps: [
    {
      step_id: { type: String, required: true },
      completed: { type: Boolean, required: true },
      value: [
        {
          type: Schema.Types.Mixed,
        },
      ],
    },
  ],
  expireAt: { type: Date, default: Date.now() + 60 * 60 * 24 * 7 }, //expire after 1 week
});

const Onboarding = mongoose.model('MemberOnboarding', onboardingSchema);

export { Onboarding };
