import { io, Socket } from 'socket.io-client';

const notificationsUrl = process.env.REACT_APP_NOTIFICATIONS_URL;

const socket: Socket | null = notificationsUrl
    ? io(notificationsUrl, { autoConnect: false })
    : null;

if (socket) {
    socket.onAny((event, ...args) => {
        console.log(event, args);
    });
}

export default socket;
