import { bot } from "../../bot";

export const suggestCommands = () => {
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
      description:
        "Setup the bot to display ads on your channel. Example: /setup [offerId] [frequency]",
    },
    {
      command: "business",
      description:
        "Are you looking for sponsors or visibility? Get started here.",
    },
  ]);
};
