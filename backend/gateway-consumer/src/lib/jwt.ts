import jwt from 'jsonwebtoken';

export const generateJWT = (member_id: string) => {
    return jwt.sign(
        {
            member_id,
        },
        process.env.JWT_KEY!
    );
};

export const generateJWTWithExpiration = (member_id: string) => {

    const accessTokenExp = Math.floor(Date.now() / 1000) + 60 * 60 * 12;

    const refreshTokenExp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;

    const accessTokenPayload = {
        user_id: member_id,
        exp: accessTokenExp,
        iat: Math.floor(Date.now() / 1000)
    };
    const accessToken = jwt.sign(accessTokenPayload, process.env.JWT_KEY!);

    const refreshTokenPayload = {
        user_id: member_id,
        exp: refreshTokenExp,
        iat: Math.floor(Date.now() / 1000)
    };
    const refreshToken = jwt.sign(refreshTokenPayload, process.env.JWT_KEY!);

    return { access_token: accessToken, refresh_token: refreshToken };

}