import type { Api, Bot, Context, RawApi } from "grammy";

export const cleanCommand = (bot: Bot<Context, Api<RawApi>>) => {
  bot.command("clean", async (ctx) => {
    await ctx.deleteMessage().catch((error) => {
      console.error("Error caught:", error);
    });
  });
};
