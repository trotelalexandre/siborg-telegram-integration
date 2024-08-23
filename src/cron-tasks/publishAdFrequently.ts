import cron from "node-cron";
import fetchAd from "../utils/fetchAd";
import { BASE_URL, CHAIN_ID } from "../env";
import type { CommandContext, Context } from "grammy";
import { TEST_MODE_ENABLED } from "../env";

export const publishAdFrequentlyTask = async (
  ctx: CommandContext<Context>,
  frequency: number,
  offerId: number
) => {
  let nextRunTime = new Date();

  const updateNextRunTime = () => {
    nextRunTime = new Date();
    nextRunTime.setMinutes(nextRunTime.getMinutes() + frequency);
  };

  const getTimeLeft = () => {
    const now = new Date();
    return Math.max(
      0,
      Math.round((nextRunTime.getTime() - now.getTime()) / 1000)
    );
  };

  cron.schedule(`*/${frequency} * * * *`, async () => {
    updateNextRunTime();

    const ad = await fetchAd(offerId).catch(async (error) => {
      await ctx.reply("Error fetching ad.");
    });

    if (!ad) {
      await ctx.reply("No ads found for this offer.");
      return;
    }

    await ctx.replyWithPhoto(ad.image, {
      caption: `Check out this ad! ${ad.link}`,
    });
    await ctx.reply(
      `Do you want to display your ad too? Check out ${BASE_URL}/${CHAIN_ID}/offer/${offerId}`
    );

    console.log(`Ad fetched and displayed on the channel.`);
  });

  if (TEST_MODE_ENABLED) {
    cron.schedule("*/5 * * * * *", () => {
      const timeLeft = getTimeLeft();
      console.log(`Time left for the next ad fetch: ${timeLeft} seconds`);
    });
  }

  updateNextRunTime();

  await ctx.reply(
    `Ad setup complete. Ads will be fetched every ${frequency} minutes.`
  );
};
