import axios from 'axios';
import { generateOTPWithoutMemberID } from './otp';
import nodemailer from 'nodemailer';
import ejs from 'ejs';
import path from 'path';
import fs from 'fs';

export const sendEmailVerificationMail = async (memberId: string, tomail: string) => {
    try {
        const otp = generateOTPWithoutMemberID();

        const result = await axios.post(`${process.env.SERVICE_POINT}/member/update/verificationcode`, {
            member_id: memberId,
            email_verification_code: otp,
        });

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SAMUDAI_MAIL,
                pass: process.env.SAMUDAI_MAIL_PASSWORD,
            },
        });
        // Read the EJS template file
        const templatePath = path.join(__dirname, '../mail.ejs');
        const template = fs.readFileSync(templatePath, 'utf-8');

        // Render the template with the OTP
        const html = ejs.render(template, { otp: otp });

        const mailOptions = {
            from: process.env.SAMUDAI_MAIL,
            to: tomail,
            subject: 'Your OTP',
            html: html,
        };

        await transporter.sendMail(mailOptions);

        return true;
    } catch (err: any) {
        return err;
    }
};
