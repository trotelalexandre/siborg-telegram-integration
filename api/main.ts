import { webhookCallback } from "grammy";
import { bot } from "../src/bot";
import { businessCommand } from "../src/commands/business";
import { helpCommand } from "../src/commands/help";
import { manageCommand } from "../src/commands/manage";
import { setupCommand } from "../src/commands/setup";
import { startCommand } from "../src/commands/start";
import { suggestCommands } from "../src/commands/suggest";
import { displayAdCommand } from "../src/commands/test/displayAd";
import { fetchAdsCommand } from "../src/commands/test/fetchAds";
import { CHAIN_ID } from "../src/env";
import { messageFallbackHandler } from "../src/handlers/messageFallback";

export default webhookCallback(bot, "std/http");

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
