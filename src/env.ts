import dotenv from "dotenv";

dotenv.config();

export const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
export const CHAIN_ID = parseInt(process.env.CHAIN_ID!);
export const BASE_URL = process.env.BASE_URL ?? "https://app.dsponsor.com";
export const TEST_ENV = process.env.TEST_ENV === "true";
export const FORMS_URL = "https://forms.dsponsor.com";
export const WEBHOOK_URL = process.env.WEBHOOK_URL!;
export const TEST_MODE_ENABLED = process.env.TEST_ENV === "true";
export const THIRDWEB_SECRET_KEY = process.env.THIRDWEB_SECRET_KEY!;

export const chatIdsKey = "chatIds";

function checkIfMissingEnv(envs: string[]) {
  for (const env of envs) {
    if (!process.env[env]) {
      throw new Error(`${env} is not defined`);
    }
  }

  return true;
}

const requiredEnv = [
  "TELEGRAM_BOT_TOKEN",
  "CHAIN_ID",
  "TEST_ENV",
  "BASE_URL",
  "WEBHOOK_URL",
];

export const ALL_ENV = checkIfMissingEnv(requiredEnv);
