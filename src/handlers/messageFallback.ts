import type { Api, Bot, Context, RawApi } from "grammy";

export const messageFallbackHandler = (bot: Bot<Context, Api<RawApi>>) => {
  bot.on("message", async (ctx) => {
    await ctx.reply(
      "To get started, you can simply type /start. If you need any help, you can use /help."
    );
  });
};
