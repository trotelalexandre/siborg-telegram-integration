import { BASE_URL, CHAIN_ID, THIRDWEB_SECRET_KEY } from "../src/env";
import { bot } from "../src/bot";
import fetchAd from "../src/utils/fetchAd";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import axios from "axios";

const GET_AD_OFFERS = `
  query GetAdOffers {
    adOffers {
      id
      metadataURL
    }
  }
`;

const endpoint = `https://relayer.dsponsor.com/api/${CHAIN_ID}/graph`;

const storage = new ThirdwebStorage({
  clientId: THIRDWEB_SECRET_KEY,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const response = await axios
      .post(
        endpoint,
        {
          query: GET_AD_OFFERS,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => response.data);

    const offers: any[] = response?.data?.adOffers;

    if (offers?.length === 0) {
      console.warn("No offers found.");
      res.status(200).json({ message: "No offers found." });
      return;
    }

    const offersMetadata: {
      offerId: number;
      telegramIntegration: {
        enabled: boolean;
        telegramChannels: number[];
      };
    }[] = await Promise.all(
      offers?.map(async (offer: any) => {
        const metadata = await storage?.downloadJSON(offer?.metadataURL);

        return {
          offerId: Number(offer?.id),
          telegramIntegration: metadata?.offer?.telegramIntegration,
        };
      })
    );

    for (const offer of offersMetadata) {
      if (offer?.telegramIntegration) {
        for (const chatId of offer?.telegramIntegration?.telegramChannels) {
          if (!offer?.telegramIntegration?.enabled) {
            console.warn(
              `Telegram integration is disabled for offer id: ${offer.offerId}`
            );
            continue;
          }

          const ad = await fetchAd(offer?.offerId);

          if (!ad) {
            console.warn(`No ads found for offer id: ${offer.offerId}`);
            continue;
          }

          await bot.api.sendPhoto(chatId, ad.image, {
            caption: `Check out this ad! ${ad.link}`,
          });

          await bot.api.sendMessage(
            chatId,
            `Do you want to display your ad too? Check out ${BASE_URL}/${CHAIN_ID}/offer/${offer?.offerId}`,
            {
              link_preview_options: {
                is_disabled: true,
              },
            }
          );

          console.log(`Ad fetched and displayed on chat id: ${chatId}`);
        }
      }
    }

    res.status(200).json({ message: "Ad fetched and displayed." });
  } catch (error) {
    console.error("Error fetching or sending ad:", error);
    res.status(500).json({ message: "Error fetching or sending ad." });
  }
}
