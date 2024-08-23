import { bot } from "../../api/bot";
import { businessMenu } from "../menus/business";

export const businessCommand = () => {
  bot.command("business", async (ctx) => {
    await ctx.reply("Are you looking for sponsors or visibility?", {
      reply_markup: businessMenu,
    });
  });
};
