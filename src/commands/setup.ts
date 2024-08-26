import type { Api, Bot, Context, RawApi } from "grammy";

export const setupCommand = (bot: Bot<Context, Api<RawApi>>) => {
  bot.command("setup", async (ctx) => {
    const chatId = ctx?.chat?.id;

    if (!chatId) {
      await ctx
        .reply("This command is only available in a group chat.")
        .catch((error) => {
          console.error("Error caught:", error);
        });
      return;
    }

    await ctx
      .reply(
        `Your chat id is: ${chatId}. You can now use this chat id to create or update your offers. (Type /manage [address] to start.)`
      )
      .catch((error) => {
        console.error("Error caught:", error);
      });
  });
};
