import { bot } from "../bot";

export const messageFallbackHandler = () => {
  bot.on("message", async (ctx) => {
    await ctx.reply(
      "To get started, you can simply type /start. If you need any help, you can use /help."
    );
  });
};
