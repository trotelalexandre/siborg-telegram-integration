import type { Api, Bot, Context, RawApi } from "grammy";

export const suggestCommands = async (bot: Bot<Context, Api<RawApi>>) => {
  await bot.api.setMyCommands([
    {
      command: "start",
      description: "Get started to manage your offers, tokens, and ads.",
    },
    { command: "help", description: "Get help and learn how to use the bot." },
    {
      command: "setup",
      description:
        "Setup the bot to display ads on your channel. Example: /setup [offerId] [frequency]",
    },
    {
      command: "business",
      description:
        "Are you looking for sponsors or visibility? Get started here.",
    },
    {
      command: "manage",
      description:
        "Manage your offers and tokens here. Example: /manage [address]",
    },
    {
      command: "change",
      description:
        "Change the frequency or offer id of the ad display. Example: /change [frequency|offerId] [value]",
    },
  ]);
};
