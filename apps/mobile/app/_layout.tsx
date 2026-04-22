import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerBackTitle: "Retour" }}>
        <Stack.Screen
          name="login"
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen name="register" options={{ title: "Inscription" }} />
        <Stack.Screen
          name="dashboard"
          options={{ title: "Dashboard", headerLeft: () => null }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
