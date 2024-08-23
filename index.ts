import { Bot, InlineKeyboard } from "grammy";
import { Menu } from "@grammyjs/menu";
import dotenv from "dotenv";
import { isAddress } from "viem";
import { fetchAd, fetchTokenIdsFromOfferId } from "./relayer";
import cron from "node-cron";

// types
import type { Address } from "viem";

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

// config menu
const configMenu = new Menu("config-menu").text(
  "Add my address",
  async (ctx) => {
    awaitingAddress = true;
    await ctx.reply(
      "To configure the bot, you need to specify your address. Please provide your address."
    );
  }
);

// onboarding menu
const onboardingMenu = new Menu("onboarding-menu")
  .text("Configure the bot", async (ctx) => {
    await ctx.reply("You can configure the bot here.", {
      reply_markup: configMenu,
    });
  })
  .row()
  .text("Manage your offer and your tokens", async (ctx) => {
    if (!profileAddress) {
      const noAddressKeyboard = new InlineKeyboard().url(
        "Create a new offer",
        `${baseURL}/${chainId}/offer/create`
      );

      await ctx.reply("You can manage your offers and tokens here", {
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

      await ctx.reply("You can manage your offers and tokens here.", {
        reply_markup: addressKeyboard,
      });
    }
  });

// exit address configuration
const exitAddressMenu = new Menu("exit-address-menu").text(
  "Exit",
  async (ctx) => {
    awaitingAddress = false;
    await ctx.reply("You have exited the address configuration.");
  }
);

// interactive menu
bot.use(configMenu);
bot.use(onboardingMenu);
bot.use(exitAddressMenu);

// start command explain briefly what is the bot about
bot.command("start", async (ctx) => {
  await ctx.reply(
    "Welcome ! SiBorg Ads is the way to monetize your Telegram channels by allowing you to display ads. To get started, you can configure the bot to specify your address.",
    {
      reply_markup: onboardingMenu,
    }
  );
});

bot.command("help", async (ctx) => {
  await ctx.reply("");
});

bot.command("config", async (ctx) => {
  await ctx.reply("You can configure the bot here.", {
    reply_markup: configMenu,
  });
});

bot.command("setup", async (ctx) => {
  if (!ctx.match) {
    await ctx.reply(
      "Please provide the offer ID, display type, and frequency in minutes. Example: /setup [offerId] [frequency]"
    );
    return;
  }

  const args: string[] = ctx.match.split(" ");

  const offerId: number = parseInt(args[0]);
  const frequency: number = parseInt(args[1]);

  // make a cron job to fetch the ads every frequency minutes and display them on the channel
  cron.schedule(`*/${frequency} * * * *`, async () => {
    const ad = await fetchAd(offerId).catch(async (error) => {
      await ctx.reply("Error fetching ad.");
    });

    if (!ad) {
      await ctx.reply("No ads found for this offer.");
      return;
    }

    await ctx.replyWithPhoto(ad.image, {
      caption: `Check out this ad! ${ad.link}`,
    });
    await ctx.reply(`Do you want to add your ad too? Check out ${baseURL}`);

    console.log(`Ad fetched and displayed on the channel.`);
  });

  await ctx.reply(
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

    console.log(`Fetching ads for offer ${offerId}...`);
    const ads = await fetchTokenIdsFromOfferId(offerId).catch(async (error) => {
      await ctx.reply("Error fetching ads.");
    });

    await ctx.reply("Ads have been fetched.");

    if (ads) {
      ads?.forEach(async (tokenId: bigint, index: number) => {
        await ctx.reply(`${baseURL}/${chainId}/offer/${offerId}/${tokenId}`);
      });
    }
  });

  bot.command("displayAd", async (ctx) => {
    if (!ctx.match) {
      ctx.reply("Please provide the offer ID.");
      return;
    }

    const offerId: number = parseInt(ctx.match);

    console.log(`Fetching ad for offer ${offerId}...`);
    const ad = await fetchAd(offerId).catch(async (error) => {
      await ctx.reply("Error fetching ad.");
    });

    if (!ad) {
      await ctx.reply("No ads found for this offer.");
      return;
    }

    await ctx.replyWithPhoto(ad.image, {
      caption: `Check out this ad! ${ad.link}`,
    });

    await ctx.reply(`Do you want to add your ad too? Check out ${baseURL}`);

    console.log(`Ad fetched and displayed on the channel.`);
  });
}

// address configuration
bot.on("message:text", async (ctx) => {
  if (awaitingAddress) {
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

    profileAddress = ctx.message.text;
    await ctx.reply(`Your address ${profileAddress} has been saved!`);
  }
});

// message fallback
bot.on("message", async (ctx) => {
  await ctx.reply(
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
