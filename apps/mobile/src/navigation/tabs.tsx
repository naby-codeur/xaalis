import { MENU_ITEMS } from "shared";

export const MOBILE_TAB_ITEMS = MENU_ITEMS.filter(
  (item) => item.mobile?.tab,
);

export type MobileTabKey = (typeof MOBILE_TAB_ITEMS)[number]["key"];
