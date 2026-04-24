<<<<<<< HEAD
import { MENU_ITEMS } from "shared";

export const MOBILE_TAB_ITEMS = MENU_ITEMS.filter(
  (item) => item.mobile?.tab,
);

export type MobileTabKey = (typeof MOBILE_TAB_ITEMS)[number]["key"];
=======
// Emplacement r\u00e9serv\u00e9 pour la configuration des bottom tabs mobile.
// La navigation r\u00e9elle est aujourd'hui d\u00e9clar\u00e9e via Expo Router dans app/(tabs).
export {};
>>>>>>> f83ab1a772188044adad3cd39c72a329ac1d0bf7
