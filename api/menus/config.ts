import { Menu } from "@grammyjs/menu";
import { bot } from "../bot";
import { setAwaitingAddress } from "../states/address";

export const configMenu = new Menu("config-menu").text(
  "Add my address",
  async (ctx) => {
    setAwaitingAddress(true);
    await ctx.reply(
      "To configure the bot, you need to specify your address. Please provide your address."
    );
  }
);

bot.use(configMenu);
