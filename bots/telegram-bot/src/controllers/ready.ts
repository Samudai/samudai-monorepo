import axios from "axios";
import { sendAPIreq } from "../utils/rmqUtil";

export const telegramCreate = async (ctx: any) => {
  console.log(`Generated Telegram Id ${ctx.message.text}`);
  try {
    if (ctx.message.text != "start" && ctx.message.text.length === 6) {
      const res = await axios.post(
        `${process.env.GATEWAY_EXTERNAL}/telegram/create`,
        {
          telegram: {
            chat_id: ctx.from.id.toString(),
            username: ctx.from.username,
            first_name: ctx.from.first_name,
            last_name: ctx.from.last_name,
            generated_telegram_id: ctx.message.text,
          },
        }
      );

      ctx.reply(
        "Congrats " +
          ctx.from.first_name +
          "! Successfully verified your Telegram... You'll now be recieving notifications"
      );
    }
  } catch (err: any) {
    let message, error;
    if (err.response) {
      message = "Error occured while creating Telegram";
      error = err.response.data.error;

      if ((error = "No rows found for the specified generated_telegram_id")) {
        ctx.reply("Ohho! Its seems that you otp is incorrect.. Try again");
      }
    } else if (err.request) {
      message = "error while requesting data";
      error = JSON.stringify(err.request);
      ctx.reply("Sorry, Something went wrong..");
    } else {
      message = "error occured";
      error = err;
      ctx.reply("Sorry, Something went wrong..");
    }
    console.log(message, error);
  }
};

// Points

export const telegramCreateForPoint = async (ctx: any) => {
  try {
    const msg = ctx.message;

    if (msg.chat.type == "group") {
      if (msg.text.startsWith(
        'Points, points, points! Samudai is bringing the fun to our Telegram group with automated point dispersals! Let the points parade begin! Unique Code: '
      ) && ctx.message.text != "start") {

        const arr = msg.text.split(':');
        const otp = arr[1].substring(1)
        console.log(otp);
        
        const payload = {
          chat_id: msg.chat.id.toString(),
          username: msg.chat.title,
          first_name: msg.chat.title,
          last_name: "",
          otp: otp,
        };

        const res = await axios.post(
          `${process.env.GATEWAY_EXTERNAL}/telegram/create/point`,
          {
            telegram: payload,
          }
        );

        ctx.reply(
          "Congrats " +
            ctx.from.first_name +
            "! Successfully linked your Telegram."
        );
      }
    } else {
      if (ctx.message.text != "start" && ctx.message.text.length === 6) {
        const payload = {
          chat_id: msg.chat.id.toString(),
          username: msg.chat.username,
          first_name: msg.chat.first_name,
          last_name: ctx.from.last_name,
          otp: ctx.message.text,
        };

        const res = await axios.post(
          `${process.env.GATEWAY_EXTERNAL}/telegram/create/point`,
          {
            telegram: payload,
          }
        );

        ctx.reply(
          "Congrats! Samudai is Successfully integrated with the Telegram group" +
          msg.chat.title
        );
      }
    }
  } catch (err: any) {
    let message, error;
    if (err.response) {
      message = "Error occured while linking Telegram Group";
      error = err.response.data.error;

      if ((error = "No rows found for the specified generated_telegram_id")) {
        ctx.reply("Ohho! Its seems that you otp is incorrect.. Try again");
      }
    } else if (err.request) {
      message = "error while requesting data";
      error = JSON.stringify(err.request);
      ctx.reply("Sorry, Something went wrong..");
    } else {
      message = "error occured";
      error = err;
      ctx.reply("Sorry, Something went wrong..");
    }
    console.log(message, error);
  }
};

export const grpJoiningPointsTipping = async (ctx: any) => {
  try {
    console.log(ctx.message);
    const msg = ctx.message;
    if (!msg.new_chat_member.is_bot) {
      const payload = {
        requestType: "TelegramTip",
        group_chat_id: msg.chat.id.toString(),
        chat_type: msg.chat.type,
        chat_name: msg.chat.title,
        joinee_chat_id: msg.new_chat_member.id.toString(),
        joinee_username: msg.new_chat_member.username,
        joinee_first_name: msg.new_chat_member.first_name,
        event_name: "new_member_joining",
      };

      sendAPIreq(JSON.stringify(payload));
    } else {
      if (msg.new_chat_member.username === process.env.TELEGRAM_USERNAME) {
        ctx.reply(
          "gm " +
            ctx.from.first_name +
            "!! \nPlease enter the string shown on Samudai to link " +
            msg.chat.title
        );
      }
    }
  } catch (err: any) {
    let message, error;
    if (err.response) {
      message = "Error occured while linking Telegram Group";
      error = err.response.data.error;

      if ((error = "No rows found for the specified generated_telegram_id")) {
        ctx.reply("Ohho! Its seems that you otp is incorrect.. Try again");
      }
    } else if (err.request) {
      message = "error while requesting data";
      error = JSON.stringify(err.request);
      ctx.reply("Sorry, Something went wrong..");
    } else {
      message = "error occured";
      error = err;
      ctx.reply("Sorry, Something went wrong..");
    }
    console.log(message, error);
  }
};
