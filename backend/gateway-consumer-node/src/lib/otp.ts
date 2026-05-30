import * as crypto from "crypto";

export const generateOTP = (member_id : string, timestamp: string) => {
  const combinedString = member_id + timestamp;

  const hashedResult = crypto.createHash('sha256').update(combinedString).digest('hex');

  const otp = hashedResult.slice(0, 6);

  return otp;
}

export const generateOTPWithoutMemberID = () => {
  const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < 6; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
}