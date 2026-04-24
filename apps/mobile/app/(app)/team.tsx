import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { api } from "@/src/services/api";
import { getAuthenticatedUser } from "@/src/store/auth.store";

export default function TeamScreen() {
  const user = getAuthenticatedUser();
  const [values, setValues] = useState<{ label: string; value: number }[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const response = await api.metrics.team();
        if (!mounted) return;
        setValues(response.series);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      }
    }
    void load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Equipe</Text>
      <View style={styles.card}>
        <Text style={styles.text}>
          Utilisateur actif: {user?.email ?? "inconnu"}
        </Text>
        {error ? <Text style={styles.warn}>{error}</Text> : null}
        {!error && values.length === 0 ? (
          <Text style={styles.text}>Aucune metrique equipe disponible.</Text>
        ) : null}
        {values.map((entry) => (
          <View key={entry.label} style={styles.row}>
            <Text style={styles.textStrong}>{entry.label}</Text>
            <Text style={styles.text}>{entry.value.toLocaleString("fr-FR")}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: "#fff", padding: 24 },
  title: { fontSize: 24, fontWeight: "600", marginBottom: 12, color: "#18181b" },
  card: {
    borderWidth: 1,
    borderColor: "#e4e4e7",
    borderRadius: 10,
    padding: 14,
    backgroundColor: "#fafafa",
  },
  row: { paddingVertical: 8 },
  text: { color: "#3f3f46", lineHeight: 20 },
  textStrong: { color: "#18181b", fontWeight: "600", lineHeight: 20 },
  warn: { color: "#b45309", lineHeight: 20 },
});
