import { BASE_URL, CHAIN_ID, CONFIG_KEY, TEST_MODE_ENABLED } from "../src/env";
import { bot } from "../src/bot";
import fetchAd from "../src/utils/fetchAd";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { kv } from "@vercel/kv";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  let configurations: {
    [key: string]: { frequency: number; offerId: number; lastPublish: number };
  } = {};

  try {
    const data = await kv.get(CONFIG_KEY);
    if (typeof data === "string") {
      configurations = JSON.parse(data);
    } else {
      configurations = {};
    }
  } catch (error) {
    console.error("Error reading configurations:", error);
    res.status(500).json({ message: "Error reading configurations." });
    return;
  }

  const { offerIdData, telegramChatIdData } = req.query;
  const offerId = parseInt(offerIdData as string);
  const telegramChatId = parseInt(telegramChatIdData as string);

  if (!TEST_MODE_ENABLED) {
    res.status(403).json({ message: "Cron job is not enabled." });
    return;
  }

  if (isNaN(offerId) || isNaN(telegramChatId)) {
    res.status(400).json({ message: "Invalid parameters." });
    return;
  }

  const config = configurations[telegramChatId];

  if (!config || config.offerId !== offerId) {
    res.status(404).json({ message: "Configuration not found for this chat." });
    return;
  }

  const now = Date.now();
  const timeSinceLastPublish = now - config.lastPublish;

  if (timeSinceLastPublish < config.frequency * 60 * 1000) {
    res.status(200).json({ message: "Not yet time to publish the ad." });
    return;
  }

  try {
    const ad = await fetchAd(offerId);

    if (!ad) {
      res.status(404).json({ message: "No ads found for this offer." });
      return;
    }

    await bot.api.sendPhoto(telegramChatId, ad.image, {
      caption: `Check out this ad! ${ad.link}`,
    });

    await bot.api.sendMessage(
      telegramChatId,
      `Do you want to display your ad too? Check out ${BASE_URL}/${CHAIN_ID}/offer/${offerId}`
    );

    console.log(`Ad fetched and displayed on the channel.`);

    configurations[telegramChatId].lastPublish = now;
    await kv.set(CONFIG_KEY, JSON.stringify(configurations));

    res.status(200).json({ message: "Ad fetched and displayed." });
  } catch (error) {
    console.error("Error fetching or sending ad:", error);
    res.status(500).json({ message: "Error fetching or sending ad." });
  }
}
