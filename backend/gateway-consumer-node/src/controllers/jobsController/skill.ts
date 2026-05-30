import axios from 'axios';
import { NextFunction, Request, Response } from 'express';
import ErrorException from '../../errors/exceptionHandlerHelper';
import { FetchSuccess } from '../../lib/helper/Responsehandler';

export class SkillConroller {
    // createSkill = async (req: Request, res: Response, next: NextFunction) => {
    //   try {
    //     const skill: Skill = req.body.skill;
    //     const result = await axios.post(`${process.env.SERVICE_JOB}/skill/create`, {
    //       skill: skill,
    //     });
    //     res.status(201).send({ message: 'Skill Created Successfully', data: result.data });
    //   } catch (err: any) {
    //     if (err.response) {
    //       return res
    //         .status(err.response.status)
    //         .send({ message: 'Error while creating a skill', error: err.response.data });
    //     } else {
    //       return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
    //     }
    //   }
    // };

    getSkillListForJob = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.get(`${process.env.SERVICE_JOB}/skill/list/job`);
            new FetchSuccess(res, 'SKILL', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while retrieving skills'));
        }
    };

    getSkillListForBounty = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await axios.get(`${process.env.SERVICE_JOB}/skill/list/bounty`);
            new FetchSuccess(res, 'SKILL', result);
        } catch (err: any) {
            next(new ErrorException(err, 'Error while retrieving skills'));
        }
    };

    // deleteSkill = async (req: Request, res: Response, next: NextFunction) => {
    //   try {
    //     const result = await axios.delete(`${process.env.SERVICE_JOB}/skill/delete/${req.params.skillId}`);
    //     res.status(200).send({ message: 'Skill Deleted Successfully', data: result.data });
    //   } catch (err: any) {
    //     if (err.response) {
    //       return res
    //         .status(err.response.status)
    //         .send({ message: 'Error while deleting a skill', error: err.response.data });
    //     } else {
    //       return res.status(500).send({ message: 'Internal server error', error: JSON.stringify(err) });
    //     }
    //   }
    // };
}
