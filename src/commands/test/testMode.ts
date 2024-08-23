import type { Api, Bot, Context, RawApi } from "grammy";
import { TEST_ENV } from "../../env";

export const testModeCommand = (bot: Bot<Context, Api<RawApi>>) => {
  if (TEST_ENV) {
    bot.command("testMode", async (ctx) => {
      await ctx.reply("Test mode is enabled.");
    });
  }
};
