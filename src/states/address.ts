import { type Address } from "viem";

let profileAddress: Address | undefined = undefined;
let awaitingAddress: boolean = false;

export function setProfileAddress(address: Address) {
  profileAddress = address;
}

export function setAwaitingAddress(state: boolean) {
  awaitingAddress = state;
}

export function getProfileAddress(): Address | undefined {
  return profileAddress;
}

export function getAwaitingAddress(): boolean {
  return awaitingAddress;
}
