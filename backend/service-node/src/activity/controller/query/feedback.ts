import { FeedbackSchema } from '../../models/feedbackSchema';
import { Feedback } from '../../utils/types';

export class FeedbackQuery {

    addFeedback = async (feedback: Feedback) => {
        try {
          const newFeedback = await FeedbackSchema.create(feedback);
        } catch (err: any) {
          console.log(err);
        }
      };

}