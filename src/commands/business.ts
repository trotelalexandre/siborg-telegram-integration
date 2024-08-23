import { bot } from "../../api/main";
import { businessMenu } from "../menus/business";

export const businessCommand = () => {
  bot.command("business", async (ctx) => {
    await ctx.reply("Are you looking for sponsors or visibility?", {
      reply_markup: businessMenu,
    });
  });
};
