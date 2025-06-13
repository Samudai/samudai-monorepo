import { io } from 'socket.io-client';

// const socket = io('https://service-notification-ncw6y.ondigitalocean.app', {
//   autoConnect: false,
// });

const socket = io(`${process.env.REACT_APP_NOTIFICATIONS_URL}`, {
    autoConnect: false,
});

socket.onAny((event, ...args) => {
    console.log(event, args);
});

export default socket;
