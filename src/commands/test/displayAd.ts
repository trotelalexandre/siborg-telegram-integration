import type { Api, Bot, Context, RawApi } from "grammy";
import { BASE_URL, CHAIN_ID, TEST_ENV } from "../../env";
import fetchAd from "../../utils/fetchAd";

export const displayAdCommand = (bot: Bot<Context, Api<RawApi>>) => {
  if (TEST_ENV) {
    bot.command("displayAd", async (ctx) => {
      if (!ctx.match) {
        ctx.reply("Please provide the offer id.");
        return;
      }

      const offerId: number = parseInt(ctx.match);

      console.log(`Fetching ad for offer ${offerId}...`);
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
        `Do you want to display your ad too? Check out ${BASE_URL}/${CHAIN_ID}/offer/${offerId}`,
        {
          link_preview_options: {
            is_disabled: true,
          },
        }
      );

      console.log(`Ad fetched and displayed on the channel.`);
    });
  }
};
