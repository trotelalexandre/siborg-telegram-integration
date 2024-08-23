import { Bot, webhookCallback } from "grammy";
import { businessCommand } from "../src/commands/business";
import { helpCommand } from "../src/commands/help";
import { manageCommand } from "../src/commands/manage";
import { setupCommand } from "../src/commands/setup";
import { startCommand } from "../src/commands/start";
import { suggestCommands } from "../src/commands/suggest/commands";
import { displayAdCommand } from "../src/commands/test/displayAd";
import { fetchAdsCommand } from "../src/commands/test/fetchAds";
import { CHAIN_ID, TELEGRAM_BOT_TOKEN } from "../src/env";
import { messageFallbackHandler } from "../src/handlers/messageFallback";
import { initMenus } from "../src/menus/init/initMenus";
import express from "express";

if (!TELEGRAM_BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN is not defined");
}

export const bot = new Bot(TELEGRAM_BOT_TOKEN);

// set webhook
const endpoint = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook?url=${process.env.WEBHOOK_URL}`;
bot.api.setWebhook(endpoint);

// init menus
initMenus(bot);

// commands
suggestCommands(bot);
startCommand(bot);
helpCommand(bot);
setupCommand(bot);
manageCommand(bot);
businessCommand(bot);
fetchAdsCommand(bot); // test
displayAdCommand(bot); // test

// handlers
messageFallbackHandler(bot);

console.log(`Starting the bot with chain id ${CHAIN_ID}...`);

// express server
const app = express();
app.use(express.json());

app.use(webhookCallback(bot, "express"));
