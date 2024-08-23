import type { Api, Bot, Context, RawApi } from "grammy";
import { TEST_ENV, TEST_MODE_ENABLED } from "../../env";

export const testModeCommand = (bot: Bot<Context, Api<RawApi>>) => {
  if (TEST_MODE_ENABLED) {
    bot.command("testmode", async (ctx) => {
      await ctx.reply("Test mode is enabled.").catch((error) => {
        console.error("Error caught:", error);
      });
    });
    return;
  }

  if (TEST_ENV) {
    bot.command("testmode", async (ctx) => {
      await ctx
        .reply(`Test mode is not enabled. TEST_ENV is set to ${TEST_ENV}`)
        .catch((error) => {
          console.error("Error caught:", error);
        });
    });
  }
};
