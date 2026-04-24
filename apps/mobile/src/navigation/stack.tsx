<<<<<<< HEAD
import { MENU_ITEMS } from "shared";

export const MOBILE_STACK_ITEMS = MENU_ITEMS.filter(
  (item) => item.mobile && !item.mobile.tab && item.mobile.stack,
);

export type MobileStackKey = (typeof MOBILE_STACK_ITEMS)[number]["key"];
=======
// Emplacement r\u00e9serv\u00e9 pour les stacks natives mobile.
// La navigation r\u00e9elle est d\u00e9clar\u00e9e via Expo Router dans app/_layout.tsx.
export {};
>>>>>>> f83ab1a772188044adad3cd39c72a329ac1d0bf7
