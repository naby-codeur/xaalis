import { Drawer } from "expo-router/drawer";

import { MOBILE_STACK_ITEMS } from "@/src/navigation/stack";

const DRAWER_ROUTE_BY_KEY: Record<string, string> = {
  reports: "reports",
  team: "team",
  settings: "settings",
};

const DRAWER_TITLE_BY_KEY: Record<string, string> = {
  reports: "Rapports",
  team: "Equipe",
  settings: "Parametres",
};

export default function AppDrawerLayout() {
  return (
    <Drawer screenOptions={{ headerShown: false }}>
      <Drawer.Screen
        name="(tabs)"
        options={{ title: "Accueil" }}
      />
      {MOBILE_STACK_ITEMS.map((item) => {
        const route = DRAWER_ROUTE_BY_KEY[item.key];
        if (!route) return null;
        return (
          <Drawer.Screen
            key={item.key}
            name={route}
            options={{ title: DRAWER_TITLE_BY_KEY[item.key] ?? item.key }}
          />
        );
      })}
    </Drawer>
  );
}
