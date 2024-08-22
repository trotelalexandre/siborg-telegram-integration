import axios from "axios";

// types
import type { DisplayType } from "./types";

export async function fetchAds(
  chainId: number,
  offerId: number,
  type: DisplayType
) {
  const response = await axios.get(
    `https://api.adnetwork.com/ads/${chainId}/${offerId}/${type}`
  );

  console.log(response.data);

  return response.data;
}
