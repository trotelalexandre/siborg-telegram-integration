import type { Api, Bot, Context, RawApi } from "grammy";
import {
  ALL_ENV,
  BASE_URL,
  CHAIN_ID,
  TEST_MODE_ENABLED,
  WEBHOOK_URL,
} from "../env";
import { escapeMarkdownV2 } from "../utils/escapeMarkdownV2";

export const statusCommand = (bot: Bot<Context, Api<RawApi>>) => {
  bot.command("status", async (ctx) => {
    await ctx.reply(
      `*Status*: [Online](${escapeMarkdownV2(BASE_URL)})\n\n` +
        `*Current Chain ID*: ${escapeMarkdownV2(CHAIN_ID?.toString())}\n\n` +
        `*Current Chat ID*: ${escapeMarkdownV2(ctx.chat?.id?.toString())}\n\n` +
        `*Test Mode*: ${TEST_MODE_ENABLED ? "ENABLED" : "DISABLED"}\n\n` +
        `*WEBHOOK\\_URL*: ${escapeMarkdownV2(WEBHOOK_URL)}\n\n` +
        `*Environment Variables*: ${ALL_ENV ? "All set" : "Missing"}\n\n` +
        `*Environment*: ${escapeMarkdownV2(process.env.NODE_ENV ?? "undefined")?.toUpperCase()}\n\n` +
        `*Note*: This bot is still in development\\. We appreciate your feedback and suggestions\\.`,

      {
        parse_mode: "MarkdownV2",
      }
    );
  });
};
