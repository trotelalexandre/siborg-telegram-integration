import { webhookCallback } from "grammy";
import { CHAIN_ID } from "../src/env";
import { bot } from "../src/bot";

console.log(`Starting the bot with chain id ${CHAIN_ID}...`);

export default webhookCallback(bot, "http");
