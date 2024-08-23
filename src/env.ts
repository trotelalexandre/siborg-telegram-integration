import dotenv from "dotenv";

dotenv.config();

export const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN!;
export const CHAIN_ID = parseInt(process.env.CHAIN_ID!);
export const BASE_URL = process.env.BASE_URL ?? "https://app.dsponsor.com";
export const TEST_ENV = process.env.TEST_ENV === "true";
export const FORMS_URL = "https://forms.dsponsor.com";
export const WEBHOOK_URL = process.env.WEBHOOK_URL!;
export const TEST_MODE_ENABLED = process.env.TEST_ENV === "true";
