import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Drawer } from "expo-router/drawer";
import { Redirect } from "expo-router";

import { MOBILE_STACK_ITEMS } from "@/src/navigation/stack";
import { initializeAuthSession } from "@/src/services/api";
import { getAuthenticatedUser } from "@/src/store/auth.store";

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
  const [ready, setReady] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function ensureSession() {
      if (getAuthenticatedUser()) {
        if (!mounted) return;
        setAllowed(true);
        setReady(true);
        return;
      }
      const ok = await initializeAuthSession();
      if (!mounted) return;
      setAllowed(ok);
      setReady(true);
    }
    void ensureSession();
    return () => {
      mounted = false;
    };
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="small" />
      </View>
    );
  }

  if (!allowed) {
    return <Redirect href="/login" />;
  }

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
