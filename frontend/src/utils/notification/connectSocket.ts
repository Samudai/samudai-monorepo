import { setNotificationSocket, setPushNotificationSocket } from 'store/features/common/slice';
import store from 'store/store';
import socket from './socket';
import { createSocketConnection } from '@pushprotocol/socket';
import { ENV } from '@pushprotocol/socket/src/lib/constants';

const connectSocket = async (memberId: string) => {
    socket.auth = { memberId };
    socket.connect();
    store.dispatch(setNotificationSocket({ socket }));
    // store.dispatch({ type: 'socket/connect' });
    // const res = await axios.post('http://localhost:3001/login', { userId });
    return true;
};

export const connectPushSDKSocket = async (account: string) => {
    const pushSDKSocket = createSocketConnection({
        user: `eip155:${account}`,
        env: ENV.PROD,
        socketType: 'chat',
        socketOptions: { autoConnect: true, reconnectionAttempts: 3 },
    });
    if (pushSDKSocket) {
        const pushSocket = await pushSDKSocket.connect();
        store.dispatch(setPushNotificationSocket({ pushSDKSocket: pushSocket }));
    }
    // store.dispatch({ type: 'socket/connect' });
    // const res = await axios.post('http://localhost:3001/login', { userId });
    return true;
};

export default connectSocket;
