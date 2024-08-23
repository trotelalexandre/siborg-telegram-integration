import { BASE_URL, CHAIN_ID, chatIdsKey } from "../src/env";
import { bot } from "../src/bot";
import fetchAd from "../src/utils/fetchAd";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { kv } from "@vercel/kv";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const chatIds = await kv.get<number[]>(chatIdsKey);

    if (!chatIds || chatIds.length === 0) {
      res.status(404).json({ message: "No chat ids found." });
      return;
    }

    for (const chatId of chatIds) {
      const config = (await kv.get(chatId?.toString())) as {
        frequency: number;
        offerId: number;
        lastPublish: number;
      };

      if (!config) {
        console.warn(`Configuration not found for chat id: ${chatId}`);
        continue;
      }

      const now = Date.now();
      const timeSinceLastPublish = now - config.lastPublish;

      if (timeSinceLastPublish < config.frequency * 60 * 1000) {
        console.log(`Not yet time to publish the ad for chat id: ${chatId}`);
        continue;
      }

      console.log(`Config for chat id: ${chatId}`, config);

      const ad = await fetchAd(config.offerId);

      if (!ad) {
        console.warn(`No ads found for offer id: ${config.offerId}`);
        continue;
      }

      await bot.api.sendPhoto(chatId, ad.image, {
        caption: `Check out this ad! ${ad.link}`,
      });

      await bot.api.sendMessage(
        chatId,
        `Do you want to display your ad too? Check out ${BASE_URL}/${CHAIN_ID}/offer/${config.offerId}`
      );

      console.log(`Ad fetched and displayed on chat id: ${chatId}`);

      config.lastPublish = now;
      await kv.set(chatId?.toString(), config);
    }

    res.status(200).json({ message: "Ad fetched and displayed." });
  } catch (error) {
    console.error("Error fetching or sending ad:", error);
    res.status(500).json({ message: "Error fetching or sending ad." });
  }
}
