import jwt from 'jsonwebtoken';

export const generateJWT = (member_id: string) => {
  return jwt.sign(
    {
      member_id,
    },
    process.env.JWT_KEY!
  );
};
