import type { Api, Bot, Context, RawApi } from "grammy";
import { onboardingMenu } from "../menus/onboarding";

export const startCommand = (bot: Bot<Context, Api<RawApi>>) => {
  bot.command("start", async (ctx) => {
    await ctx
      .reply(
        "Welcome! SiBorg Ads is the way to monetize your Telegram channels by allowing you to display ads. To get started, you can configure the bot to specify your address.",
        {
          reply_markup: onboardingMenu,
        }
      )
      .catch((error) => {
        console.error("Error caught:", error);
      });

    await ctx.reply(`Chat ID: ${ctx.chat.id}`).catch((error) => {
      console.error("Error caught:", error);
    });
  });
};
