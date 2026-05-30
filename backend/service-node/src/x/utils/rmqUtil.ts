import mqConnection from '../config/rabbitmqConfig';
const TWITTER_EXCHANGE = '@twitterPointsDisperseExchange';

export const sendTwitterAPIreq = async (req: string) => {
  await mqConnection.sendToExchange(TWITTER_EXCHANGE, 'twitterRouting', req);
  console.log('API Twitter request sent 🚀 ', req);
};
