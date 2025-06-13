import mqConnection from "../config/rabbitmqConfig";
const API_EXCHANGE = "@telegramPointsDisperseExchange";

export const sendAPIreq = async (req: string) => {
  await mqConnection.sendToExchange(API_EXCHANGE, "telegramProductsRouting", req);
  console.log("API request sent 🚀");
};
