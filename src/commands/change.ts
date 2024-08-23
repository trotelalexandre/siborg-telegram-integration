import type { Api, Bot, CommandContext, Context, RawApi } from "grammy";
import { kv } from "@vercel/kv";

export const changeCommand = (bot: Bot<Context, Api<RawApi>>) => {
  bot.command("change", async (ctx) => {
    const chatId = ctx?.chat?.id;

    if (!chatId) {
      await ctx.reply("This command is only available in a group chat.");
      return;
    }

    if (!ctx.match) {
      await ctx.reply(
        "Please provide the frequency or offer id, and the value. Example: /change [frequency|offerId] [value]"
      );
      return;
    }

    const args: string[] = ctx.match.split(" ");

    if (args.length < 2) {
      await ctx.reply(
        "Please provide the frequency or offer id, and the value. Example: /change [frequency|offerId] [value]"
      );
      return;
    }

    const key = args[0];
    const value = parseInt(args[1]);

    if (isNaN(value)) {
      await ctx.reply(
        "Please provide a valid number for the frequency or offer id."
      );
      return;
    }

    if (key === "frequency") {
      await changeFrequency(chatId, value, ctx);
    } else if (key === "offerId") {
      await changeOffer(chatId, value, ctx);
    } else {
      await ctx.reply(
        "Please provide the frequency or offer id, and the value. Example: /change [frequency|offerId] [value]"
      );
      return;
    }

    await ctx.reply(`Configuration updated. ${key} set to ${value}.`);
  });
};

async function changeFrequency(
  chatId: number,
  frequency: number,
  ctx: CommandContext<Context>
) {
  try {
    const config = (await kv.get(chatId?.toString())) as {
      offerId: number;
      lastPublish: number;
      frequency: number;
    };

    if (!config) {
      await ctx.reply("Configuration not found. Use /setup to create one.");
      throw new Error("Configuration not found.");
    }

    config.frequency = frequency;

    await kv.set(chatId?.toString(), config);
  } catch (error) {
    console.error("Error fetching configuration:", error);
    return;
  }
}

async function changeOffer(
  chatId: number,
  offerId: number,
  ctx: CommandContext<Context>
) {
  try {
    const config = (await kv.get(chatId?.toString())) as {
      offerId: number;
      lastPublish: number;
      frequency: number;
    };

    if (!config) {
      await ctx.reply("Configuration not found. Use /setup to create one.");
      throw new Error("Configuration not found.");
    }

    config.offerId = offerId;

    await kv.set(chatId?.toString(), config);
  } catch (error) {
    console.error("Error fetching configuration:", error);
    return;
  }
}
