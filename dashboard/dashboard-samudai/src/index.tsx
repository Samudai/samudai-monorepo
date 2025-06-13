import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import store from './store/store';
import deviceApple from 'utils/device/deviceApple';
import 'utils/device/scriptsRegister';
import supportWebp from 'utils/device/supportWebp';
import 'styles/style.scss';
import App from './App';
import 'swiper/css';
import Loader from 'components/Loader/Loader';
import { PrivyProvider } from '@privy-io/react-auth';

require('dotenv').config();

if (process.env.REACT_APP_ENV !== 'local' && process.env.REACT_APP_ENV !== 'development') {
    console.log = () => {};
    console.error = () => {};
    console.debug = () => {};
}

deviceApple();
supportWebp();

const rootElement = document.getElementById('app');

if (!rootElement) {
    throw Error('Not found root element');
}

const root = ReactDOM.createRoot(rootElement);
const handleLogin = (user: any) => {
    console.log(`User ${user.id} logged in!`);
};

root.render(
    <PrivyProvider
        appId={'clo49k9hm01vlmb0fdq21b1k6'}
        onSuccess={handleLogin}
        config={{
            loginMethods: ['email', 'github', 'google', 'wallet'],
            appearance: {
                theme: '#17191A',
                accentColor: '#C0EFCA',
            },
            embeddedWallets: {
                createOnLogin: 'users-without-wallets',
            },
        }}
    >
        <Suspense fallback={<Loader />}>
            <Provider store={store}>
                <Router>
                    <App />
                </Router>
            </Provider>
        </Suspense>
    </PrivyProvider>
);
