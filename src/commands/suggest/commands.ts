import type { Api, Bot, Context, RawApi } from "grammy";

export const suggestCommands = (bot: Bot<Context, Api<RawApi>>) => {
  bot.api.setMyCommands([
    {
      command: "start",
      description: "Get started to manage your offers, tokens, and ads",
    },
    { command: "help", description: "Get help and learn how to use the bot" },
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
    { command: "manage", description: "Manage your offers and tokens here" },
  ]);
};
