import { bot } from "../bot";
import { businessCommand } from "../commands/business";
import { configCommand } from "../commands/config";
import { helpCommand } from "../commands/help";
import { setupCommand } from "../commands/setup";
import { startCommand } from "../commands/start";
import { suggestCommands } from "../commands/suggest";
import { displayAdCommand } from "../commands/test/displayAd";
import { fetchAdsCommand } from "../commands/test/fetchAds";
import { CHAIN_ID } from "../env";
import { addressHandler } from "../handlers/address";
import { messageFallbackHandler } from "../handlers/messageFallback";

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
