import { bot } from "../src/bot";
import { TELEGRAM_BOT_TOKEN, WEBHOOK_URL } from "../src/env";

const endpoint = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook?url=${WEBHOOK_URL}`;
bot.api.setWebhook(endpoint);
