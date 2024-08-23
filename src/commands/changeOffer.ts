import type { Api, Bot, CommandContext, Context, RawApi } from "grammy";
import { kv } from "@vercel/kv";

export const changeOfferCommand = (bot: Bot<Context, Api<RawApi>>) => {
  bot.command("changeOffer", async (ctx) => {
    const chatId = ctx?.chat?.id;

    if (!ctx.match) {
      ctx.reply("Please provide the frequency.");
      return;
    }

    const offerId: number = parseInt(ctx.match);

    console.log(`Changing offer id to ${offerId}...`);

    await changeOffer(chatId, offerId, ctx).catch(async (error) => {
      await ctx.reply("Error changing frequency.");
    });
    await ctx.reply("Offer has been changed.");
  });
};

async function changeOffer(
  chatId: number,
  offerId: number,
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

    config.offerId = offerId;

    await kv.set(chatId?.toString(), config);
  } catch (error) {
    console.error("Error fetching configuration:", error);
    return;
  }
}
