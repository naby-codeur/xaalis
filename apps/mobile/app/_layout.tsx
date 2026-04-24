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
<<<<<<< HEAD
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
=======
>>>>>>> f83ab1a772188044adad3cd39c72a329ac1d0bf7
        <Stack.Screen
          name="login"
          options={{ headerShown: false, gestureEnabled: false }}
        />
        <Stack.Screen name="register" options={{ title: "Inscription" }} />
<<<<<<< HEAD
=======
        <Stack.Screen
          name="dashboard"
          options={{ title: "Dashboard", headerLeft: () => null }}
        />
>>>>>>> f83ab1a772188044adad3cd39c72a329ac1d0bf7
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
