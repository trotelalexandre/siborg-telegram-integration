import { Bot, webhookCallback } from "grammy";
import { TELEGRAM_BOT_TOKEN } from "./env";

export const bot = new Bot(TELEGRAM_BOT_TOKEN);

export default webhookCallback(bot, "std/http");
