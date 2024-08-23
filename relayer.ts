import axios from "axios";
import dotenv from "dotenv";
import { randomInt } from "crypto";

// load environment variables
dotenv.config();

// config variables
const chainId: number = parseInt(process.env.CHAIN_ID!);

// config
const relayerURL = "https://relayer.dsponsor.com";
const relayerApiURL = `https://relayer.dsponsor.com/api/${chainId}`;

export async function fetchTokenIdsFromOfferId(
  offerId: number
): Promise<bigint[] | undefined> {
  // get every token id for an offer id
  let response;
  try {
    response = await axios.get(`${relayerApiURL}/ads/${offerId}`);
  } catch (error) {
    console.error("Error fetching token ids from the relayer", error);
    throw new Error("Error fetching token ids from the relayer");
  }

  const tokenIds: bigint[] | undefined = response?.data?._tokenIds?.map(
    (tokenId: string) => BigInt(tokenId)
  );

  const sortedTokenIds = tokenIds?.sort((a, b) => Number(a) - Number(b));

  return sortedTokenIds;
}

export async function fetchAd(
  offerId: number
): Promise<{ image: string; link: string } | null> {
  let response;
  try {
    response = await axios.get(`${relayerApiURL}/ads/${offerId}`);
  } catch (error) {
    console.error("Error fetching ad from the relayer", error);
    throw new Error("Error fetching ad from the relayer");
  }

  const fetchedAds = response?.data;

  const acceptedAds = Object?.values(fetchedAds)?.filter((ad: any) => {
    return Object?.keys(ad)?.every((param) => {
      if (ad?.[param]?.state) {
        return ad?.[param]?.state === "CURRENT_ACCEPTED";
      } else {
        return true;
      }
    });
  });

  const filteredAds = acceptedAds?.filter(
    (ad) =>
      typeof ad === "object" &&
      ad !== null &&
      Object.values(ad).some((value) => value?.data)
  );

  if (filteredAds.length === 0) {
    return null;
  }

  const randomIndex = randomInt(filteredAds?.length);
  const selectedAd: any = filteredAds?.[randomIndex];

  const imageParam = Object?.keys(selectedAd)?.find((key) =>
    key?.includes("image")
  );
  const linkParam = Object?.keys(selectedAd)?.find((key) =>
    key?.includes("link")
  );

  return {
    image: selectedAd[imageParam as string]?.data,
    link: selectedAd[linkParam as string]?.data,
  };
}
