import { Menu } from "@grammyjs/menu";
import { InlineKeyboard } from "grammy";
import { BASE_URL, CHAIN_ID } from "../env";

export const onboardingMenu = new Menu("onboarding-menu")
  .text("Start to display ads", async (ctx) => {
    await ctx
      .reply(
        `To start displaying ads, you need to enter the following commands: /setup [offerId] [frequency]\n\n` +
          `Example: /setup 1 5 (This will display ads from offer id 1 every 5 minutes)\n\n` +
          `If you don't have an offer yet, you can create one by clicking the button below\n\n`,
        {
          reply_markup: new InlineKeyboard().url(
            "Create a new offer",
            `${BASE_URL}/${CHAIN_ID}/offer/create`
          ),
        }
      )
      .catch((error) => {
        console.error("Error caught:", error);
      });
  })
  .row()
  .text("Manage your offer and your tokens", async (ctx) => {
    const noAddressKeyboard = new InlineKeyboard().url(
      "Create a new offer",
      `${BASE_URL}/${CHAIN_ID}/offer/create`
    );

    await ctx
      .reply("You can manage your offers and tokens here", {
        reply_markup: noAddressKeyboard,
      })
      .catch((error) => {
        console.error("Error caught:", error);
      });
  });
