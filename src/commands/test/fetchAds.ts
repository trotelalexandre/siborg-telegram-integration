import type { Api, Bot, Context, RawApi } from "grammy";
import { BASE_URL, CHAIN_ID, TEST_ENV } from "../../env";
import fetchTokenIdsFromOfferId from "../../utils/fetchTokenIdsFromOfferId";

export const fetchAdsCommand = (bot: Bot<Context, Api<RawApi>>) => {
  if (TEST_ENV) {
    bot.command("fetchAds", async (ctx) => {
      if (!ctx.match) {
        ctx.reply("Please provide the offer id.");
        return;
      }

      const offerId: number = parseInt(ctx.match);

      console.log(`Fetching ads for offer ${offerId}...`);
      const ads = await fetchTokenIdsFromOfferId(offerId).catch(
        async (error) => {
          await ctx.reply("Error fetching ads.");
        }
      );

      await ctx.reply("Ads have been fetched.");

      if (ads) {
        ads?.forEach(async (tokenId: bigint, index: number) => {
          await ctx.reply(
            `${BASE_URL}/${CHAIN_ID}/offer/${offerId}/${tokenId}`
          );
        });
      }
    });
  }
};
