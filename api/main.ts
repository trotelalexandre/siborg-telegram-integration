import { bot } from "../src/bot";
import { businessCommand } from "../src/commands/business";
import { configCommand } from "../src/commands/config";
import { helpCommand } from "../src/commands/help";
import { setupCommand } from "../src/commands/setup";
import { startCommand } from "../src/commands/start";
import { suggestCommands } from "../src/commands/suggest";
import { displayAdCommand } from "../src/commands/test/displayAd";
import { fetchAdsCommand } from "../src/commands/test/fetchAds";
import { CHAIN_ID } from "../src/env";
import { addressHandler } from "../src/handlers/address";
import { messageFallbackHandler } from "../src/handlers/messageFallback";

// commands
suggestCommands();
startCommand();
helpCommand();
configCommand();
setupCommand();
businessCommand();
fetchAdsCommand(); // test
displayAdCommand(); // test

// handlers
addressHandler();
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
