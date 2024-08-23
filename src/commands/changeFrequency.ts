import type { Api, Bot, CommandContext, Context, RawApi } from "grammy";
import { kv } from "@vercel/kv";

export const changeFrequencyCommand = (bot: Bot<Context, Api<RawApi>>) => {
  bot.command("changeFrequency", async (ctx) => {
    const chatId = ctx?.chat?.id;

    if (!ctx.match) {
      ctx.reply("Please provide the frequency.");
      return;
    }

    const frequency: number = parseInt(ctx.match);

    console.log(`Changing frequency to ${frequency}...`);

    await changeFrequency(chatId, frequency, ctx).catch(async (error) => {
      await ctx.reply("Error changing frequency.");
    });
    await ctx.reply("Frequency has been changed.");
  });
};

async function changeFrequency(
  chatId: number,
  frequency: number,
  ctx: CommandContext<Context>
) {
  try {
    const config = (await kv.get(chatId?.toString())) as {
      offerId: number;
      lastPublish: number;
      frequency: number;
    };

    if (!config) {
      await ctx.reply("Configuration not found. Use /setup to create one.");
      throw new Error("Configuration not found.");
    }

    config.frequency = frequency;

    await kv.set(chatId?.toString(), config);
  } catch (error) {
    console.error("Error fetching configuration:", error);
    return;
  }
}
