import mixpanel from 'mixpanel-browser';

// or with require() syntax:
// const mixpanel = require('mixpanel-browser');

// Enabling the debug mode flag is useful during implementation,
// but it's recommended you remove it for production
require('dotenv').config();
mixpanel.init(process.env.REACT_APP_MIXPANEL_TOKEN!, {
    debug: true,
});

export default mixpanel;
