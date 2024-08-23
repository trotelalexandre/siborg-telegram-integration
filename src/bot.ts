import { Bot } from "grammy";
import { TELEGRAM_BOT_TOKEN } from "./env";

if (!TELEGRAM_BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN is not defined");
}

export const bot = new Bot(TELEGRAM_BOT_TOKEN);
