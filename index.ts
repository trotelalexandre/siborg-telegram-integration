import { Bot, InlineKeyboard } from "grammy";
import { Menu } from "@grammyjs/menu";
import dotenv from "dotenv";
import { isAddress } from "viem";
import type { Address } from "viem";

dotenv.config();

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);
const chainId = process.env.CHAIN_ID!;
const baseURL = "https://app.dsponsor.com";

let profileAddress: Address | undefined = undefined;
let awaitingAddress = false;

// onboarding menu
const onboardingMenu = new Menu("onboarding-menu")
  .text("Configure the bot", (ctx) => {
    awaitingAddress = true;
    ctx.reply(
      "To configure the bot, you need to specify your address. Please provide your address."
    );
  })
  .text("Manage your offer and your tokens", (ctx) => {
    if (!profileAddress) {
      const noAddressKeyboard = new InlineKeyboard().url(
        "Create a new offer",
        `${baseURL}/${chainId}/offer/create`
      );

      ctx.reply("You can manage your offers and tokens here", {
        reply_markup: noAddressKeyboard,
      });
    } else {
      const addressKeyboard = new InlineKeyboard()
        .url("Create a new offer", `${baseURL}/${chainId}/offer/create`)
        .url(
          "View owned tokens",
          `${baseURL}/profile/${profileAddress}?tab=owned`
        )
        .row()
        .url(
          "View created offers",
          `${baseURL}/profile/${profileAddress}?tab=createdOffers`
        )
        .url("View statistics", `${baseURL}/profile/${profileAddress}`);

      ctx.reply("You can manage your offers and tokens here", {
        reply_markup: addressKeyboard,
      });
    }
  });

// exit address configuration
const exitAddressMenu = new Menu("exit-address-menu").text("Exit", (ctx) => {
  awaitingAddress = false;
  ctx.reply("You have exited the address configuration.");
});

// interactive menu
bot.use(onboardingMenu);
bot.use(exitAddressMenu);

// start command explain briefly what is the bot about
bot.command("start", (ctx) => {
  ctx.reply(
    "Welcome ! SiBorg Ads is the way to monetize your Telegram channels by allowing you to display ads. To get started, you can configure the bot to specify your address.",
    {
      reply_markup: onboardingMenu,
    }
  );
});

// address configuration
bot.on("message:text", (ctx) => {
  if (awaitingAddress) {
    if (!ctx.message.text) {
      ctx.reply("Please provide an address.", {
        reply_markup: exitAddressMenu,
      });
      return;
    }

    if (!isAddress(ctx.message.text)) {
      ctx.reply("The address you provided is invalid. Try again.", {
        reply_markup: exitAddressMenu,
      });
      return;
    }

    profileAddress = ctx.message.text;
    ctx.reply(`Your address ${profileAddress} has been saved!`);
  }
});

// message fallback
bot.on("message", (ctx) => {
  ctx.reply(
    "To get started, you can simply type /start. If you need any help, you can use /help."
  );
});

console.log("Starting the bot...");
bot.start();
