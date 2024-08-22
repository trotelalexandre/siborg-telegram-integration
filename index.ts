import { Bot, InlineKeyboard } from "grammy";
import { Menu } from "@grammyjs/menu";
import dotenv from "dotenv";

dotenv.config();

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN!);
const chainId = process.env.CHAIN_ID!;

// onboarding menu
const onboardingMenu = new Menu("onboarding-menu")
  .text("Configure the bot on the channel", (ctx) =>
    ctx.reply(
      "Pour configurer le bot sur votre canal, utilisez la commande /setup_bot."
    )
  )
  .text("Manage your offer and your tokens.", (ctx) => {
    const keyboard = new InlineKeyboard().url(
      "Create a new offer",
      `https://app.dsponsor.com/${chainId}/offer/create`
    );

    ctx.reply("You can manage your offers and tokens here", {
      reply_markup: keyboard,
    });
  });

// interactive menu
bot.use(onboardingMenu);

// start command explain briefly what is the bot about
bot.command("start", (ctx) => {
  ctx.reply(
    "Welcome ! SiBorg Ads is the way to monetize your Telegram channels by allowing you to display ads.",
    {
      reply_markup: onboardingMenu,
    }
  );
});

// message fallback
bot.on("message", (ctx) => {
  ctx.reply(
    "To get started, you simply type /start. If you need any help, you can type /help."
  );
});

console.log("Starting the bot...");
bot.start();
