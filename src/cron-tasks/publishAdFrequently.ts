import cron from "node-cron";
import fetchAd from "../utils/fetchAd";
import { BASE_URL, CHAIN_ID } from "../env";
import type { CommandContext, Context } from "grammy";

export const publishAdFrequentlyTask = async (
  ctx: CommandContext<Context>,
  frequency: number,
  offerId: number
) => {
  cron.schedule(`*/${frequency} * * * *`, async () => {
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

  await ctx.reply(
    `Ad setup complete. Ads will be fetched every ${frequency} minutes.`
  );
};
