import axios from "axios";
import { randomInt } from "crypto";
import { RELAYER_API_URL } from "../relayer/config";

export default async function fetchAd(
  offerId: number
): Promise<{ image: string; link: string } | null> {
  let response;
  try {
    response = await axios.get(`${RELAYER_API_URL}/ads/${offerId}`);
  } catch (error) {
    console.error("Error fetching ad from the relayer", error);
    throw new Error("Error fetching ad from the relayer");
  }

  const fetchedAds = response?.data;
  console.log("Fetched ads:", fetchedAds);

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
