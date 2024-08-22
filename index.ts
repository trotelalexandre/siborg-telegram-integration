import { Bot, InlineKeyboard } from "grammy";
import { Menu } from "@grammyjs/menu";
import dotenv from "dotenv";
import { isAddress } from "viem";
import { fetchAds } from "./relayer";
import cron from "node-cron";

// types
import type { Address } from "viem";
import type { DisplayType } from "./types";

// load environment variables
dotenv.config();

// create a new bot
const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);

// config variables
const chainId: number = parseInt(process.env.CHAIN_ID!);
const baseURL: string = "https://app.dsponsor.com";

// global variables
let profileAddress: Address | undefined = undefined;
let awaitingAddress: boolean = false;

let displayType: DisplayType | undefined = undefined;

// display type menu
const displayTypeMenu = new Menu("display-type-menu")
  .text("Clickable Logo Grid", (ctx) => {
    displayType = "ClickableLogoGrid";
    ctx.reply("Display type has been set to Clickable Logo Grid.");
  })
  .row()
  .text("Dynamic Banner", (ctx) => {
    displayType = "DynamicBanner";
    ctx.reply("Display type has been set to Dynamic Banner.");
  });

// config menu
const configMenu = new Menu("config-menu")
  .text("Add my address", (ctx) => {
    awaitingAddress = true;
    ctx.reply(
      "To configure the bot, you need to specify your address. Please provide your address."
    );
  })
  .row()
  .text("Change display type", (ctx) => {
    ctx.reply("You can change the display type here.", {
      reply_markup: displayTypeMenu,
    });
  });

// onboarding menu
const onboardingMenu = new Menu("onboarding-menu")
  .text("Configure the bot", (ctx) => {
    ctx.reply("You can configure the bot here.", {
      reply_markup: configMenu,
    });
  })
  .row()
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

      ctx.reply("You can manage your offers and tokens here.", {
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
bot.use(displayTypeMenu);
bot.use(configMenu);
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

bot.command("help", (ctx) => {
  ctx.reply("");
});

bot.command("config", (ctx) => {
  ctx.reply("You can configure the bot here.", {
    reply_markup: configMenu,
  });
});

bot.command("setup", (ctx) => {
  const offerId: number = parseInt(ctx.match);
  const type: DisplayType = displayType ?? "DynamicBanner";
  const frequency: number = parseInt(ctx.match);

  // make a cron job to fetch the ads every frequency minutes and display them on the channel
  cron.schedule(`*/${frequency} * * * *`, async () => {
    const ads = await fetchAds(chainId, offerId, type);

    // TODO : display ads on the channel
  });
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

bot.catch((err) => {
  console.error(err);

  // wait for 5 seconds before restarting the bot
  setTimeout(() => {
    console.log("Restarting the bot...");
    bot.start();
  }, 5000);
});
