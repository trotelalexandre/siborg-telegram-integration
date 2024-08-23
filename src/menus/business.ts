import { Menu } from "@grammyjs/menu";
import { bot } from "../bot";
import { FORMS_URL } from "../env";

export const businessMenu = new Menu("business-menu")
  .url("I'm looking for sponsors", `${FORMS_URL}/looking-for-sponsors`)
  .row()
  .url("I'm looking for visibility", `${FORMS_URL}/looking-for-visibility`);

bot.use(businessMenu);
