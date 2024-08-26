import type { Api, Bot, Context, RawApi } from "grammy";
import { BASE_URL } from "../env";

export const helpCommand = (bot: Bot<Context, Api<RawApi>>) => {
  bot.command("help", async (ctx) => {
    await ctx
      .reply(
        `*Help Menu*\n\n` +
          `Here is a list of commands you can use:\n\n` +
          `*/start* \\- Get started to manage your offers, tokens, and ads\\.\n` +
          `*/help* \\- Get help and learn how to use the bot\\.\n` +
          `*/manage [address]* \\- Manage your offers and tokens here\\.\n` +
          `*/setup* \\- Setup the bot to display ads on your channel\\. (Only available in group chats\\.)\n` +
          `*/change [frequency\\|offerId] [value]* \\- Change the frequency or offer id of the ad display\\. Example: \`/change frequency 10\` will change the frequency to 10 minutes\\.\n` +
          `*/business* \\- If you're looking for sponsors or visibility, get started here\\.\n\n` +
          `*Additional Info:*\n\n` +
          `\\- Use the /config command to add your address and configure your settings\\.\n` +
          `\\- Use the /setup command to schedule ad displays on your channel\\. You need to specify the offer id and the frequency in minutes\\.\n` +
          `\\- If you encounter any issues, try restarting the bot or contact support\\.\n\n` +
          `\\- If you have some issues, type /status to check the bot status\\.\n\n` +
          `*Note:* This bot is still in development\\. We appreciate your feedback and suggestions\\.\n\n` +
          `For more details, visit our [website](${BASE_URL})\\.`,
        {
          parse_mode: "MarkdownV2",
        }
      )
      .catch((error) => {
        console.error("Error caught:", error);
      });
  });
};
