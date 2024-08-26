import type { Api, Bot, Context, RawApi } from "grammy";

export const suggestCommands = async (bot: Bot<Context, Api<RawApi>>) => {
  await bot.api
    .setMyCommands([
      {
        command: "start",
        description: "Get started to manage your offers, tokens, and ads.",
      },
      {
        command: "help",
        description: "Get help and learn how to use the bot.",
      },
      {
        command: "setup",
        description:
          "Setup the bot to display ads on your channel. (Only available in group chats.)",
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
        command: "clean",
        description:
          "Clean the chat by deleting the message from SiBorg Ads bot.",
      },
    ])
    .catch((error) => {
      console.error("Error setting commands suggestions:", error);
    });
};
