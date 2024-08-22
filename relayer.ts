import axios from "axios";
import dotenv from "dotenv";

// types
import type { DisplayType } from "./types";

// load environment variables
dotenv.config();

// config variables
const chainId: number = parseInt(process.env.CHAIN_ID!);

// config
const relayerURL = "https://relayer.dsponsor.com";
const relayerApiURL = `https://relayer.dsponsor.com/api/${chainId}`;

export async function fetchTokenIdsFromOfferId(offerId: number) {
  // get every token id for an offer id
  const response = await axios.get(`${relayerApiURL}/ads/${offerId}`);

  const tokenIds: bigint[] | undefined = response?.data?._tokenIds?.map(
    (tokenId: string) => BigInt(tokenId)
  );

  return tokenIds;
}

export async function fetchAds(offerId: number, type: DisplayType) {
  const tokenIds = await fetchTokenIdsFromOfferId(offerId);

  let adsToDisplay: {
    image: string;
    link: string;
  }[] = [];

  if (tokenIds) {
    const ads: {
      image: string;
      link: string;
    }[] = await Promise.all(
      tokenIds?.map(async (tokenId: bigint) => {
        const imageResponse = await axios.get(
          `${relayerURL}/${chainId}/integrations/${offerId}/${tokenId?.toString()}/image`
        );
        const linkResponse = await axios.get(
          `${relayerURL}/${chainId}/integrations/${offerId}/${tokenId?.toString()}/link`
        );

        const ad = {
          image: imageResponse.data,
          link: linkResponse.data,
        };
        return ad;
      })
    );

    // choose random ad and return an array with only one ad
    if (type === "DynamicBanner") {
      const randomAd = ads[Math.floor(Math.random() * ads.length)];
      adsToDisplay = [randomAd];
    } else {
      adsToDisplay = ads;
    }
  }

  console.log(adsToDisplay);
  return adsToDisplay;
}
