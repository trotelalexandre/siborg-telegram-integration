import { bot } from "../bot";
import { onboardingMenu } from "../menus/onboarding";

export const startCommand = () => {
  bot.command("start", async (ctx) => {
    await ctx.reply(
      "Welcome! SiBorg Ads is the way to monetize your Telegram channels by allowing you to display ads. To get started, you can configure the bot to specify your address.",
      {
        reply_markup: onboardingMenu,
      }
    );
  });
};
