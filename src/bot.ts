import { Bot } from "grammy";
import { businessCommand } from "../src/commands/business";
import { helpCommand } from "../src/commands/help";
import { manageCommand } from "../src/commands/manage";
import { setupCommand } from "../src/commands/setup";
import { startCommand } from "../src/commands/start";
import { suggestCommands } from "../src/commands/suggest/commands";
import { displayAdCommand } from "../src/commands/test/displayAd";
import { fetchAdsCommand } from "../src/commands/test/fetchAds";
import { TELEGRAM_BOT_TOKEN } from "../src/env";
import { initMenus } from "../src/menus/init/initMenus";

if (!TELEGRAM_BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN is not defined");
}

export const bot = new Bot(TELEGRAM_BOT_TOKEN);

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
