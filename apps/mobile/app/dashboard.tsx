import { StyleSheet, Text, View } from "react-native";

export default function DashboardScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tableau de bord</Text>
      <Text style={styles.subtitle}>
        Les m\u00e9triques seront aliment\u00e9es par GET /v1/metrics/overview.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#fff",
  },
  title: { fontSize: 24, fontWeight: "600" },
  subtitle: { fontSize: 14, color: "#6b7280" },
});
