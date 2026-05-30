import { Request, Response } from 'express';
import { FeedbackQuery } from './query/feedback';
import { Feedback } from '../utils/types';

export class FeedbackController {

    FeedbackQuery : FeedbackQuery;

    constructor() {
        this.FeedbackQuery = new FeedbackQuery();
    }

    addFeedbackForSamudai =  async (req: Request, res: Response) => {
        try {
            const feedback: Feedback = req.body.feedback;
            feedback.date = new Date().toISOString();
            const result = await this.FeedbackQuery.addFeedback(feedback);
            res.status(201).json({ message: 'Feedback added successfully', data: result });
          } catch (err: any) {
            if (err.response) {
              return res
                .status(err.response.status)
                .send({ message: 'Could not add Feedback', error: err.response.data.err });
            } else {
              return res.status(500).send({ message: 'Error adding Feedback', error: err });
            }
          }
    }
}