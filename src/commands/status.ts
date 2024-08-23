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
      `*Status*: [Online](${BASE_URL?.replace(/[-.]/g, "\\$&")})\n\n` +
        `*Current Chain ID*: ${CHAIN_ID?.toString()?.replace(/[-.]/g, "\\$&")}\n\n` +
        `*Current Chat ID*: ${ctx.chat?.id?.toString()?.replace(/[-.]/g, "\\$&")}\n\n` +
        `*Test Mode*: ${TEST_MODE_ENABLED ? "Enabled" : "Disabled"}\n\n` +
        `*APP\\_URL*: ${APP_URL?.replace(/[-.]/g, "\\$&")}\n\n` +
        `*WEBHOOK\\_URL*: ${WEBHOOK_URL?.replace(/[-.]/g, "\\$&")}\n\n` +
        `*Environment Variables*: ${ALL_ENV ? "All set" : "Missing"}\n\n` +
        `*Environment*: ${process.env.NODE_ENV ? process.env.NODE_ENV?.replace(/[-.]/g, "\\$&")?.toUpperCase() : "undefined"}\n\n` +
        `*Note*: This bot is still in development\\. We appreciate your feedback and suggestions\\.`,

      {
        parse_mode: "MarkdownV2",
      }
    );
  });
};
