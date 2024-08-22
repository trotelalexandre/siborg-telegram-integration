import { Bot, InlineKeyboard } from "grammy";
import { Menu } from "@grammyjs/menu";
import dotenv from "dotenv";
import { isAddress } from "viem";
import { fetchAds, fetchTokenIdsFromOfferId } from "./relayer";
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
const baseURL: string = process.env.BASE_URL ?? "https://app.dsponsor.com";
const testEnv: boolean = process.env.TEST_ENV === "true";

// global variables
let profileAddress: Address | undefined = undefined;
let awaitingAddress: boolean = false;

let displayType: DisplayType | undefined = undefined;

// suggest commands
bot.api.setMyCommands([
  {
    command: "start",
    description: "Get started to manage your offers, tokens, and ads",
  },
  { command: "help", description: "Get help and learn how to use the bot" },
  {
    command: "config",
    description:
      "Configure the bot by setting your address, display type, etc.",
  },
  {
    command: "setup",
    description: "Setup the bot to display ads on your channel",
  },
]);

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
  if (!ctx.match) {
    ctx.reply(
      "Please provide the offer ID, display type, and frequency in minutes. Example: /setup 1 5"
    );
    return;
  }

  const args: string[] = ctx.match.split(" ");

  const offerId: number = parseInt(args[0]);
  const type: DisplayType = displayType ?? "DynamicBanner";
  const frequency: number = parseInt(args[1]);

  // make a cron job to fetch the ads every frequency minutes and display them on the channel
  cron.schedule(`*/${frequency} * * * *`, async () => {
    const ads = await fetchAds(offerId, type);

    // TODO : display ads on the channel
  });

  ctx.reply(
    `Ad setup complete. Ads will be fetched every ${frequency} minutes.`
  );
});

// fetching ads test
if (testEnv) {
  bot.command("fetchAds", async (ctx) => {
    if (!ctx.match) {
      ctx.reply("Please provide the offer ID.");
      return;
    }

    const offerId: number = parseInt(ctx.match);
    const type: DisplayType = displayType ?? "DynamicBanner";

    console.log(`Fetching ads for offer ${offerId} with type ${type}...`);
    const ads = await fetchTokenIdsFromOfferId(offerId);
    console.log(ads);

    await ctx.reply("Ads have been fetched.");

    if (ads) {
      ads?.forEach(async (tokenId: bigint, index: number) => {
        await ctx.reply(
          `Token ID n°${index} : ${baseURL}/${chainId}/offer/${offerId}/${tokenId}`
        );
      });
    }
  });
}

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

console.log(`Starting the bot with chain ID ${chainId}...`);
bot.start();

bot.catch((err) => {
  console.error(err);

  // wait for 5 seconds before restarting the bot
  setTimeout(() => {
    console.log(`Restarting the bot with chain ID ${chainId}...`);
    bot.start();
  }, 5000);
});
