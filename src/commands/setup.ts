import type { Api, Bot, Context, RawApi } from "grammy";
import { chatIdsKey, TEST_MODE_ENABLED } from "../env";
import { kv } from "@vercel/kv";

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

      try {
        await saveConfiguration(chatId, frequency, offerId);
      } catch (error) {
        console.error("Error saving configuration:", error);
        await ctx.reply("Error saving configuration.");
      }

      await ctx.reply(
        `Configuration saved. I will publish the ad every ${frequency} minutes.`
      );
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
      const frequency: number = parseInt(args[1], 10);

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

      try {
        await saveConfiguration(chatId, frequency, offerId);
      } catch (error) {
        console.error("Error saving configuration:", error);
        await ctx.reply("Error saving configuration.");
      }

      await ctx.reply(
        `Configuration saved. I will publish the ad every ${frequency} minutes.`
      );
    }
  });
};

async function saveConfiguration(
  chatId: number,
  frequency: number,
  offerId: number
) {
  try {
    const configuration = { frequency, offerId, lastPublish: Date.now() };

    await kv.set(chatId?.toString(), configuration);

    let chatIds = await kv.get<number[]>(chatIdsKey);

    if (!chatIds) {
      chatIds = [];
    }

    if (!chatIds.includes(chatId)) {
      chatIds.push(chatId);
      await kv.set(chatIdsKey, chatIds);
    }
  } catch (error) {
    console.error("Error saving configuration:", error);
  }
}
