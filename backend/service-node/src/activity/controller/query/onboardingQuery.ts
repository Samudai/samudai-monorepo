import { Onboarding } from '../../models/onboardingSchema';

export class OnboardingQuery {
  addStep = async (link_id: string, step_id: string, value: any) => {
    try {
      const exists = await Onboarding.findOne({ _id: link_id });
      if (exists) {
        const step = exists.steps.find((step) => step.step_id === step_id);
        if (step) {
          step.completed = true;
          step.value.push(value);
        } else {
          exists.steps.push({ step_id: step_id, completed: true, value: value });
        }
        if (step_id === 'type_of_member') {
          exists.member_type = value.user;
        }
        await exists.save();
      } else {
        const newOnboarding = await Onboarding.create({
          _id: link_id,
          steps: [{ step_id: step_id, completed: true, value: value }],
        });
        console.log(newOnboarding);
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  getOnboarding = async (link_id: string) => {
    try {
      const onboarding = await Onboarding.findOne({ _id: link_id }).exec();
      return onboarding;
    } catch (err: any) {
      console.log(err);
    }
  };

  getStep = async (link_id: string, step_id: string) => {
    try {
      const onboarding = await Onboarding.findOne({ _id: link_id }).exec();
      if (onboarding) {
        const step = onboarding.steps.find((step) => step.step_id === step_id);
        return step;
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  deleteOnboarding = async (link_id: string) => {
    try {
      const onboarding = await Onboarding.findOneAndDelete({ _id: link_id }).exec();
      return onboarding;
    } catch (err: any) {
      console.log(err);
    }
  };
}
