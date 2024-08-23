import type { Api, Bot, Context, RawApi } from "grammy";
import { publishAdFrequentlyCommand } from "../cron-tasks/publishAdFrequently";
import { TEST_MODE_ENABLED } from "../env";

export const setupCommand = (bot: Bot<Context, Api<RawApi>>) => {
  bot.command("setup", async (ctx) => {
    if (!ctx.match) {
      await ctx.reply(
        "Please provide the offer id, display type, and frequency in minutes. Example: /setup [offerId] [frequency]"
      );
      return;
    }

    const args: string[] = ctx.match.split(" ");

    const offerId: number = parseInt(args[0]);
    const frequency: number = parseInt(args[1]);

    if (isNaN(offerId) || isNaN(frequency)) {
      await ctx.reply(
        "Please provide the offer id, display type, and frequency in minutes. Example: /setup [offerId] [frequency]"
      );
      return;
    }

    if (frequency < 4 && !TEST_MODE_ENABLED) {
      await ctx.reply("Frequency must be at least 5 minutes.");
      return;
    }

    await publishAdFrequentlyCommand(ctx, frequency, offerId);
  });
};
