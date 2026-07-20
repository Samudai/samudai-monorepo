import axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';

// 15-minute response cache. Migrated from the unmaintained `axios-cache-adapter`
// (which pinned axios ~0.21) to `axios-cache-interceptor`, which is axios 1.x
// compatible. By default GET requests are cached; `ttl` is in milliseconds.
export const cachedAxios = setupCache(axios.create(), {
    ttl: 15 * 60 * 1000,
});
