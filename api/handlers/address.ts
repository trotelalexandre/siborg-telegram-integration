import { bot } from "../bot";
import { isAddress } from "viem";
import { exitAddressMenu } from "../menus/exitAddress";
import {
  getAwaitingAddress,
  getProfileAddress,
  setProfileAddress,
} from "../states/address";

export const addressHandler = () => {
  bot.on("message:text", async (ctx) => {
    if (getAwaitingAddress()) {
      if (!ctx.message.text) {
        await ctx.reply("Please provide an address.", {
          reply_markup: exitAddressMenu,
        });
        return;
      }

      if (!isAddress(ctx.message.text)) {
        await ctx.reply("The address you provided is invalid. Try again.", {
          reply_markup: exitAddressMenu,
        });
        return;
      }

      setProfileAddress(ctx.message.text);
      await ctx.reply(`Your address ${getProfileAddress()} has been saved!`);
    }
  });
};
