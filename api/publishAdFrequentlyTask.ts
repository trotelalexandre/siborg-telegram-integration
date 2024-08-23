import { BASE_URL, CHAIN_ID, TEST_MODE_ENABLED } from "../src/env";
import { bot } from "../src/bot";
import fetchAd from "../src/utils/fetchAd";
import { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { frequencyData, offerIdData, telegramChatIdData } = req.query;

  const offerId = parseInt(offerIdData as string);
  const telegramChatId = parseInt(telegramChatIdData as string);

  if (!TEST_MODE_ENABLED) {
    res.status(403).json({ message: "Cron job is not enabled." });
    return;
  }

  const ad = await fetchAd(offerId).catch((error) => {
    console.error("Error fetching ad:", error);
    res.status(500).json({ message: "Error fetching ad." });
  });

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
  res.status(200).json({ message: "Ad fetched and displayed." });
}
