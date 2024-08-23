import { Menu } from "@grammyjs/menu";
import { InlineKeyboard } from "grammy";
import { BASE_URL, CHAIN_ID } from "../env";
import { bot } from "../../api/main";

export const onboardingMenu = new Menu("onboarding-menu")
  .text("Start to display ads", async (ctx) => {
    await ctx.reply("");
  })
  .row()
  .text("Manage your offer and your tokens", async (ctx) => {
    const noAddressKeyboard = new InlineKeyboard().url(
      "Create a new offer",
      `${BASE_URL}/${CHAIN_ID}/offer/create`
    );

    await ctx.reply("You can manage your offers and tokens here", {
      reply_markup: noAddressKeyboard,
    });
  });

bot.use(onboardingMenu);
