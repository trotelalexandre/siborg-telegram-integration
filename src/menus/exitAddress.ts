import { Menu } from "@grammyjs/menu";
import { bot } from "../bot";
import { setAwaitingAddress } from "../states/address";

export const exitAddressMenu = new Menu("exit-address-menu").text(
  "Exit",
  async (ctx) => {
    setAwaitingAddress(false);
    await ctx.reply("You have exited the address configuration.");
  }
);

bot.use(exitAddressMenu);
