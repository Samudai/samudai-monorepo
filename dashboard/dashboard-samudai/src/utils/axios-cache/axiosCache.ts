import { setupCache } from 'axios-cache-adapter';
import axios from 'axios';

export const cache = setupCache({
    maxAge: 15 * 60 * 1000,
});

export const cachedAxios = axios.create({
    adapter: cache.adapter,
});
