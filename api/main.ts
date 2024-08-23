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

if (!TELEGRAM_BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN is not defined");
}

export const bot = new Bot(TELEGRAM_BOT_TOKEN);

//export default webhookCallback(bot, "std/http");

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
bot.start();

bot.catch((err) => {
  console.error(err);

  // wait for 5 seconds before restarting the bot
  setTimeout(() => {
    console.log(`Restarting the bot with chain id ${CHAIN_ID}...`);
    bot.start();
  }, 5000);
});
