import Redis from 'ioredis';
require('dotenv').config();

export const redis = new Redis(process.env.REDIS_URL || '');
