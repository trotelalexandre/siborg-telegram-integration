import { bot } from "../bot";
import { BASE_URL } from "../env";

export const helpCommand = () => {
  bot.command("help", async (ctx) => {
    await ctx.reply(
      `*Help Menu*\n\n` +
        `Here is a list of commands you can use:\n\n` +
        `*/start* \\- Get started to manage your offers, tokens, and ads\\.\n` +
        `*/help* \\- Get help and learn how to use the bot\\.\n` +
        `*/config* \\- Configure the bot by setting your address, display type, etc\\.\n` +
        `*/setup [offerId] [frequency]* \\- Setup the bot to display ads on your channel\\. Example: \`/setup 123 5\` will display ads from offer 123 every 5 minutes\\.\n` +
        `*/business* \\- If you're looking for sponsors or visibility, get started here\\.\n\n` +
        `*Additional Info:*\n\n` +
        `\\- Use the /config command to add your address and configure your settings\\.\n` +
        `\\- Use the /setup command to schedule ad displays on your channel\\. You need to specify the offer id and the frequency in minutes\\.\n` +
        `\\- If you encounter any issues, try restarting the bot or contact support\\.\n\n` +
        `For more details, visit our [website](${BASE_URL})\\.`,
      {
        parse_mode: "MarkdownV2",
      }
    );
  });
};
