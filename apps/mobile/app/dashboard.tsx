import { Redirect } from "expo-router";

export default function LegacyDashboardRoute() {
  return <Redirect href="/(app)/(tabs)/dashboard" />;
}
