import { Menu } from "@grammyjs/menu";
import { bot } from "../bot";
import { configMenu } from "./config";
import { InlineKeyboard } from "grammy";
import { BASE_URL, CHAIN_ID } from "../env";
import { getProfileAddress } from "../states/address";

export const onboardingMenu = new Menu("onboarding-menu")
  .text("Configure the bot", async (ctx) => {
    await ctx.reply("You can configure the bot here.", {
      reply_markup: configMenu,
    });
  })
  .row()
  .text("Manage your offer and your tokens", async (ctx) => {
    const profileAddress = getProfileAddress();

    if (!profileAddress) {
      const noAddressKeyboard = new InlineKeyboard().url(
        "Create a new offer",
        `${BASE_URL}/${CHAIN_ID}/offer/create`
      );

      await ctx.reply("You can manage your offers and tokens here", {
        reply_markup: noAddressKeyboard,
      });
    } else {
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
    }
  });

bot.use(onboardingMenu);
