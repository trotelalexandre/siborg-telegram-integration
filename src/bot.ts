import { Bot } from "grammy";
import { TELEGRAM_BOT_TOKEN } from "./env";

export const bot = new Bot(TELEGRAM_BOT_TOKEN);
