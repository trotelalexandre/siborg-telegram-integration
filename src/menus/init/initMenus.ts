import type { Api, Bot, Context, RawApi } from "grammy";
import { onboardingMenu } from "../onboarding";
import { businessMenu } from "../business";

export const initMenus = (bot: Bot<Context, Api<RawApi>>) => {
  bot.use(onboardingMenu);
  bot.use(businessMenu);
};
