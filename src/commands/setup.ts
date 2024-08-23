import type { Api, Bot, Context, RawApi } from "grammy";
import { publishAdFrequentlyTask } from "../cron-tasks/publishAdFrequently";
import { TEST_MODE_ENABLED } from "../env";

export const setupCommand = (bot: Bot<Context, Api<RawApi>>) => {
  bot.command("setup", async (ctx) => {
    if (TEST_MODE_ENABLED) {
      if (!ctx.match) {
        await ctx.reply(
          "Please provide the offer id. Example: /setup [offerId]"
        );
        return;
      }

      const offerId: number = parseInt(ctx.match);

      if (isNaN(offerId)) {
        await ctx.reply(
          "Please provide the offer id. Example: /setup [offerId] [frequency]"
        );
        return;
      }

      const frequency: number = 1;

      await publishAdFrequentlyTask(ctx, frequency, offerId);
    } else {
      if (!ctx.match) {
        await ctx.reply(
          "Please provide the offer id, and frequency in minutes. Example: /setup [offerId] [frequency]"
        );
        return;
      }

      const args: string[] = ctx.match.split(" ");

      if (args.length < 2) {
        await ctx.reply(
          "Please provide the offer id, and frequency in minutes. Example: /setup [offerId] [frequency]"
        );
        return;
      }

      const offerId: number = parseInt(args[0]);
      const frequency: number = parseInt(args[1]);

      if (isNaN(offerId) || isNaN(frequency)) {
        await ctx.reply(
          "Please provide the offer id, and frequency in minutes. Example: /setup [offerId] [frequency]"
        );
        return;
      }

      if (frequency < 4) {
        await ctx.reply("Frequency must be at least 5 minutes.");
        return;
      }

      await publishAdFrequentlyTask(ctx, frequency, offerId);
    }
  });
};
