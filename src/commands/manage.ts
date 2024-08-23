import { InlineKeyboard } from "grammy";
import { BASE_URL, CHAIN_ID } from "../env";
import { isAddress } from "viem";
import type { Api, Bot, Context, RawApi } from "grammy";

export const manageCommand = (bot: Bot<Context, Api<RawApi>>) => {
  bot.command("manage", async (ctx) => {
    if (!ctx.match) {
      return await ctx.reply(
        "Please provide an address. Example: /manage 0x1234"
      );
    }

    const profileAddress = ctx.match;

    if (!profileAddress) {
      return await ctx.reply("Please provide an address.");
    }

    if (!isAddress(profileAddress)) {
      return await ctx.reply("Invalid address. Try again.");
    }

    const addressKeyboard = new InlineKeyboard()
      .url("Create a new offer", `${BASE_URL}/${CHAIN_ID}/offer/create`)
      .url(
        "View owned tokens",
        `${BASE_URL}/profile/${profileAddress}?tab=owned`
      )
      .row()
      .url(
        "View created offers",
        `${BASE_URL}/profile/${profileAddress}?tab=createdOffers`
      )
      .url("View statistics", `${BASE_URL}/profile/${profileAddress}`);

    await ctx.reply("You can manage your offers and tokens here.", {
      reply_markup: addressKeyboard,
    });
  });
};
