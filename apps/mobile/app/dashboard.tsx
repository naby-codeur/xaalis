import { useEffect, useMemo, useState } from "react";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import type { MetricsResponse } from "shared";

import { api } from "@/src/services/api";
import { fallbackOverviewMetrics } from "@/src/store/mock-metrics";
import { getAuthenticatedUser, resetAuth } from "@/src/store/auth.store";

export default function DashboardScreen() {
  const user = getAuthenticatedUser();
  const [data, setData] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<"api" | "mock">("api");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadOverview() {
      setLoading(true);
      setError(null);
      try {
        const response = await api.metrics.overview();
        if (!mounted) return;
        setData(response);
        setSource("api");
      } catch (err) {
        if (!mounted) return;
        setData(fallbackOverviewMetrics);
        setSource("mock");
        setError(err instanceof Error ? err.message : "Failed to load metrics");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void loadOverview();
    return () => {
      mounted = false;
    };
  }, []);

  const total = useMemo(() => {
    if (!data) return 0;
    return data.series.reduce((sum, point) => sum + point.value, 0);
  }, [data]);

  function handleLogout() {
    resetAuth();
    router.replace("/login");
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tableau de bord</Text>
      <Text style={styles.subtitle}>
        {user ? `Connecte: ${user.email}` : "Session locale active"}
      </Text>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Flux net mensuel</Text>
          <Text style={styles.badge}>{source === "api" ? "API" : "Mock"}</Text>
        </View>
        <Text style={styles.cardMeta}>GET /v1/metrics/overview</Text>
        {loading ? <Text style={styles.loading}>Chargement...</Text> : null}
        {!loading && data ? (
          <View style={styles.series}>
            {data.series.map((point) => (
              <View key={point.label} style={styles.row}>
                <Text style={styles.label}>{point.label}</Text>
                <Text style={styles.value}>{point.value.toLocaleString("fr-FR")} XOF</Text>
              </View>
            ))}
          </View>
        ) : null}
        <Text style={styles.total}>Total: {total.toLocaleString("fr-FR")} XOF</Text>
        {error ? <Text style={styles.warn}>Fallback mock: {error}</Text> : null}
      </View>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Se deconnecter</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    gap: 12,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  title: { fontSize: 24, fontWeight: "600" },
  subtitle: { fontSize: 14, color: "#6b7280", marginBottom: 8 },
  card: {
    borderWidth: 1,
    borderColor: "#e4e4e7",
    borderRadius: 10,
    padding: 14,
    gap: 8,
    backgroundColor: "#fafafa",
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontSize: 16, fontWeight: "600", color: "#18181b" },
  badge: {
    fontSize: 12,
    color: "#3f3f46",
    borderWidth: 1,
    borderColor: "#d4d4d8",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  cardMeta: { fontSize: 12, color: "#71717a" },
  loading: { color: "#52525b", fontSize: 13 },
  series: { gap: 6, marginTop: 4 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  label: { color: "#3f3f46", fontSize: 13 },
  value: { color: "#18181b", fontSize: 13, fontWeight: "500" },
  total: { marginTop: 6, color: "#18181b", fontWeight: "600" },
  warn: { color: "#a16207", fontSize: 12 },
  logoutButton: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#d4d4d8",
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  logoutButtonText: { color: "#18181b", fontWeight: "500" },
});
