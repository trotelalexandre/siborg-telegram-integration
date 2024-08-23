import axios from "axios";
import { RELAYER_API_URL } from "../relayer";

export default async function fetchTokenIdsFromOfferId(
  offerId: number
): Promise<bigint[] | undefined> {
  // get every token id for an offer id
  let response;
  try {
    response = await axios.get(`${RELAYER_API_URL}/ads/${offerId}`);
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
