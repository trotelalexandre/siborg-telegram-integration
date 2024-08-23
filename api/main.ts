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

if (!TELEGRAM_BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN is not defined");
}

export const bot = new Bot(TELEGRAM_BOT_TOKEN);

//export default webhookCallback(bot, "std/http");

// commands
suggestCommands();
startCommand();
helpCommand();
setupCommand();
manageCommand();
businessCommand();
fetchAdsCommand(); // test
displayAdCommand(); // test

// handlers
messageFallbackHandler();

console.log(`Starting the bot with chain id ${CHAIN_ID}...`);
bot.start();

bot.catch((err) => {
  console.error(err);

  // wait for 5 seconds before restarting the bot
  setTimeout(() => {
    console.log(`Restarting the bot with chain id ${CHAIN_ID}...`);
    bot.start();
  }, 5000);
});
