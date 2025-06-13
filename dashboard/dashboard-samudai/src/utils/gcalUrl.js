require('dotenv').config();

const url = (host) =>
    `https://accounts.google.com/o/oauth2/auth?access_type=offline&client_id=${process.env.REACT_APP_GOOGLE_CLIENT_ID}&redirect_uri=${host}&response_type=code&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar.events+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar.events.readonly+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fcalendar.readonly+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&state=state-token&prompt=consent`;

export const gcaluser = () => {
    const host = encodeURIComponent(window.location.origin + '/gcaluser');
    return url(host);
};
export const gcaldao = () => {
    const host = encodeURIComponent(window.location.origin + '/gcaldao');
    return url(host);
};
