import { MENU_ITEMS } from "shared";

export const MOBILE_STACK_ITEMS = MENU_ITEMS.filter(
  (item) => item.mobile && !item.mobile.tab && item.mobile.stack,
);

export type MobileStackKey = (typeof MOBILE_STACK_ITEMS)[number]["key"];
