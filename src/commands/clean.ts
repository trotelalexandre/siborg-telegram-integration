import type { Api, Bot, Context, RawApi } from "grammy";

export const cleanCommand = (bot: Bot<Context, Api<RawApi>>) => {
  bot.command("clean", async (ctx) => {
    try {
      const chatId = ctx.chat.id;
      let messagesToDelete: number[] = [];

      messagesToDelete.push(ctx?.message?.message_id as number);

      /*
      let lastMessageId = ctx?.message?.message_id as number;
      while (lastMessageId > 1 && messagesToDelete.length < 100) {
        const message = await ctx.api.getMessage(chatId, lastMessageId - 1);

        if (
          message.from?.is_bot ||
          message.text?.startsWith("/") ||
          message.text?.includes("@" + bot.botInfo.username)
        ) {
          messagesToDelete.push(lastMessageId - 1);
        }

        lastMessageId--;
      }

      if (messagesToDelete.length > 0) {
        await ctx.api.deleteMessages(chatId, messagesToDelete);
      }*/

      const confirmationMsg = await ctx.reply(
        "Chat cleaned! Bot messages and commands have been removed."
      );

      setTimeout(async () => {
        await ctx.api.deleteMessage(chatId, confirmationMsg.message_id);
      }, 5000);
    } catch (error) {
      console.error("Error in clean command:", error);
      await ctx.reply("An error occurred while trying to clean the chat.");
    }
  });
};
