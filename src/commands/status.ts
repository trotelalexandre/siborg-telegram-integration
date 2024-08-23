import type { Api, Bot, Context, RawApi } from "grammy";
import {
  ALL_ENV,
  APP_URL,
  BASE_URL,
  CHAIN_ID,
  TEST_MODE_ENABLED,
  WEBHOOK_URL,
} from "../env";

export const statusCommand = (bot: Bot<Context, Api<RawApi>>) => {
  bot.command("status", async (ctx) => {
    await ctx.reply(
      `*Status*: [Online](${BASE_URL})\n\n` +
        `*Current Chain ID*: ${CHAIN_ID}\n\n` +
        `*Current Chat ID*: ${ctx.chat?.id}\n\n` +
        `*Test Mode*: ${TEST_MODE_ENABLED ? "Enabled" : "Disabled"}\n\n` +
        `*APP_URL*: ${APP_URL}\n\n` +
        `*WEBHOOK_URL*: ${WEBHOOK_URL}\n\n` +
        `*Environment Variables*: ${ALL_ENV ? "All set" : "Missing"}\n\n` +
        `*Environment*: ${process.env.NODE_ENV}\n\n` +
        `*Note*: This bot is still in development\\. We appreciate your feedback and suggestions\\.`,

      {
        parse_mode: "MarkdownV2",
      }
    );
  });
};
