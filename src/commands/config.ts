import { bot } from "../bot";
import { configMenu } from "../menus/config";

export const configCommand = () => {
  bot.command("config", async (ctx) => {
    await ctx.reply("You can configure the bot here.", {
      reply_markup: configMenu,
    });
  });
};
