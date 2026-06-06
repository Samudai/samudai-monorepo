import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import _ReactDOM from 'react-dom';

// react-transition-group v4 uses ReactDOM.findDOMNode which was removed in React 19.
// This shim restores it by walking the React fiber tree from the class instance.
(_ReactDOM as any).findDOMNode = function (component: any): Element | null {
    if (!component) return null;
    if (component instanceof Element) return component;
    const fiber = (component as any)._reactInternals;
    if (!fiber) return null;
    let node = fiber.child;
    while (node) {
        if (node.stateNode instanceof Element) return node.stateNode;
        node = node.child;
    }
    return null;
};
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

if (import.meta.env.REACT_APP_ENV !== 'local' && import.meta.env.REACT_APP_ENV !== 'development') {
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

root.render(
    <PrivyProvider
        appId={'cmptoe3nl00210clbuwc7bnf6'}
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
