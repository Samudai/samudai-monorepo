import mixpanel from 'mixpanel-browser';

const token = import.meta.env.REACT_APP_MIXPANEL_TOKEN;

// A recursive, callable no-op used when no token is configured. Calling
// mixpanel methods (register/identify/track, people.set, …) on an instance
// init'd with an empty token throws internally ("Cannot read properties of
// undefined (reading 'before_register')"). This stub lets every call site work
// unchanged when analytics is disabled.
const noopMixpanel: any = new Proxy(function () {}, {
    get: () => noopMixpanel,
    apply: () => undefined,
});

if (token) {
    mixpanel.init(token, {
        debug: import.meta.env.DEV,
    });
}

export default (token ? mixpanel : noopMixpanel) as typeof mixpanel;
