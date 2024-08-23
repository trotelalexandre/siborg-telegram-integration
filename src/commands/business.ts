import type { Api, Bot, Context, RawApi } from "grammy";
import { businessMenu } from "../menus/business";

export const businessCommand = (bot: Bot<Context, Api<RawApi>>) => {
  bot.command("business", async (ctx) => {
    await ctx.reply("Are you looking for sponsors or visibility?", {
      reply_markup: businessMenu,
    });
  });
};
