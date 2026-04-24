<<<<<<< HEAD
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Redirect } from "expo-router";

import { initializeAuthSession } from "@/src/services/api";

export default function IndexScreen() {
  const [ready, setReady] = useState(false);
  const [target, setTarget] = useState<"/login" | "/(app)/(tabs)/dashboard">(
    "/login",
  );

  useEffect(() => {
    let mounted = true;
    async function bootstrap() {
      const isAuthenticated = await initializeAuthSession();
      if (!mounted) return;
      setTarget(isAuthenticated ? "/(app)/(tabs)/dashboard" : "/login");
      setReady(true);
    }
    void bootstrap();
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

  return <Redirect href={target} />;
=======
import { Redirect } from "expo-router";

export default function IndexScreen() {
  return <Redirect href="/login" />;
>>>>>>> f83ab1a772188044adad3cd39c72a329ac1d0bf7
}
