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
import { testModeCommand } from "./commands/test/testMode";
import { statusCommand } from "./commands/status";
import { cleanCommand } from "./commands/clean";
import { onlyAdmin } from "grammy-middlewares";

if (!TELEGRAM_BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN is not defined");
}

export const bot = new Bot(TELEGRAM_BOT_TOKEN);

try {
  // middlewares
  bot.use(onlyAdmin((ctx) => ctx.reply("Only admins can use this command.")));

  // init menus
  initMenus(bot);

  // commands
  suggestCommands(bot);
  startCommand(bot);
  helpCommand(bot);
  cleanCommand(bot);
  setupCommand(bot);
  manageCommand(bot);
  businessCommand(bot);
  statusCommand(bot);
  testModeCommand(bot); // test
  fetchAdsCommand(bot); // test
  displayAdCommand(bot); // test
} catch (error) {
  console.error("Error caught:", error);
}
