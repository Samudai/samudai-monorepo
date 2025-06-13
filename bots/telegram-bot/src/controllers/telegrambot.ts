import axios from "axios";
const { Telegraf } = require("telegraf");
import { NextFunction, Request, Response } from "express";
import { grpJoiningPointsTipping, telegramCreate, telegramCreateForPoint } from "./ready";
import { disconnectTelegramMessage } from "../utils/messages";

const bot = new Telegraf(process.env.BOT_ID);

bot.start((ctx: any) =>
  ctx.reply(
    "Hey " +
      ctx.from.first_name +
      ", Cheered to have you here! Please send OTP to verify yourself and start receiving your Samudai notifications. 🎉"
  )
);

// bot.use(async (ctx: any, next: any) => {
//   console.log(ctx);
//   await next(); // runs next middleware
//   // console.timeEnd(`Processing update ${ctx.update.update_id}`);
// });
// bot.on("text", telegramCreate);
bot.on("text", telegramCreateForPoint);

bot.on("left_chat_participant", (ctx: any) => {
  console.log(ctx.message);
});

bot.on("new_chat_participant", grpJoiningPointsTipping);

bot.launch();

export const publishNotification = async (req: Request, res: Response) => {
  try {
    const telegramInfo = req.body.telegram;
    const notificationMessage = req.body.notification_message;

    telegramInfo?.map((tId: any) => {
      bot.telegram.sendMessage(tId.chat_id, notificationMessage);
    });

    res.status(200).send({
      message: "Notifications published successfully",
    });
  } catch (err: any) {
    if (err.response) {
      return res.status(400).send({
        message: "Notification Publishing failed!",
        error: err.response.data,
      });
    } else if (err.request) {
      return res.status(500).send({
        message: "Error while publishing notification",
        error: JSON.stringify(err),
      });
    }
  }
};

export const disconnectTelegram = async (req: Request, res: Response) => {
  try {
    const chat_id = req.params.chat_id;

    bot.telegram.sendMessage(chat_id, disconnectTelegramMessage);

    res.status(200).send({
      message: "Disconnect notification sent successfully",
    });
  } catch (err: any) {
    if (err.response) {
      return res.status(400).send({
        message: "Notification Publishing failed!",
        error: err.response.data,
      });
    } else if (err.request) {
      return res.status(500).send({
        message: "Error while publishing notification",
        error: JSON.stringify(err),
      });
    }
  }
};

export const healthCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.setHeader("Content-Type", "application/json");

    res.status(200).json({
      status: "Samudai Bot is running!",
    });
  } catch (error) {
    next(error);
  }
};
