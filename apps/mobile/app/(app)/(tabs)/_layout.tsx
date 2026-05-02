import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import type { ComponentProps } from "react";

import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MOBILE_TAB_ITEMS } from "@/src/navigation/tabs";

const TAB_ROUTE_BY_KEY: Record<string, string> = {
  dashboard: "dashboard",
  projects: "projects",
};

const TAB_ICON_BY_KEY: Record<string, ComponentProps<typeof MaterialIcons>["name"]> = {
  dashboard: "dashboard",
  projects: "folder",
};

const TAB_TITLE_BY_KEY: Record<string, string> = {
  dashboard: "Dashboard",
  projects: "Projets",
};

export default function AppTabsLayout() {
  const colorScheme = useColorScheme();
  const tabItems = MOBILE_TAB_ITEMS;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarButton: HapticTab,
        headerShown: false,
      }}
    >
      {tabItems.map((item) => {
        const routeName = TAB_ROUTE_BY_KEY[item.key];
        if (!routeName) return null;
        const iconName = TAB_ICON_BY_KEY[item.key] ?? "circle";
        const title = TAB_TITLE_BY_KEY[item.key] ?? item.key;
        return (
          <Tabs.Screen
            key={item.key}
            name={routeName}
            options={{
              title,
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons color={color} size={size} name={iconName} />
              ),
            }}
          />
        );
      })}
    </Tabs>
  );
}
