import type { Api, Bot, Context, RawApi } from "grammy";
import { APP_URL, TEST_MODE_ENABLED } from "../env";

export const setupCommand = (bot: Bot<Context, Api<RawApi>>) => {
  bot.command("setup", async (ctx) => {
    const chatId = ctx?.chat?.id;

    if (!chatId) {
      await ctx.reply("This command is only available in a group chat.");
      return;
    }

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
          "Please provide the offer id. Example: /setup [offerId]"
        );
        return;
      }

      const frequency: number = 1;

      await callPublishAdEndpoint(frequency, offerId, chatId, ctx);
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

      await callPublishAdEndpoint(frequency, offerId, chatId, ctx);
    }
  });
};

async function callPublishAdEndpoint(
  frequency: number,
  offerId: number,
  chatId: number,
  ctx: Context
) {
  try {
    const response = await fetch(
      `${APP_URL}/api/publishAd?frequencyData=${frequency}&offerIdData=${offerId}&telegramChatIdData=${chatId}`
    );
    const result = await response.json();

    if (response.ok) {
      await ctx.reply(
        `Ad setup complete. Ads will be fetched every ${frequency} minutes.`
      );
    } else {
      await ctx.reply(`Failed to set up ad: ${result.message}`);
    }
  } catch (error) {
    console.error("Error calling publishAd endpoint:", error);
    await ctx.reply("An error occurred while setting up the ad.");
  }
}
