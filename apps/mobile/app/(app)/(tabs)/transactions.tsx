import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { api } from "@/src/services/api";

export default function TransactionsScreen() {
  const [rows, setRows] = useState<
    {
      id: string;
      type: string;
      amount: number;
      currency: string;
      occurredAt: string;
    }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadTransactions() {
      setLoading(true);
      setError(null);
      try {
        const response = await api.transactions.list();
        if (!mounted) return;
        setRows(response.data);
      } catch (err) {
        if (!mounted) return;
        setError(
          err instanceof Error ? err.message : "Impossible de charger les transactions",
        );
      } finally {
        if (mounted) setLoading(false);
      }
    }
    void loadTransactions();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Transactions</Text>
      <View style={styles.card}>
        {loading ? <Text style={styles.text}>Chargement...</Text> : null}
        {!loading && error ? <Text style={styles.warn}>{error}</Text> : null}
        {!loading && !error && rows.length === 0 ? (
          <Text style={styles.text}>Aucune transaction pour le moment.</Text>
        ) : null}
        {!loading && !error && rows.length > 0
          ? rows.map((row) => (
              <View key={row.id} style={styles.row}>
                <Text style={styles.textStrong}>
                  {row.type} - {row.amount.toLocaleString("fr-FR")} {row.currency}
                </Text>
                <Text style={styles.text}>
                  {new Date(row.occurredAt).toLocaleDateString("fr-FR")}
                </Text>
              </View>
            ))
          : null}
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
  row: {
    borderBottomWidth: 1,
    borderBottomColor: "#e4e4e7",
    paddingVertical: 10,
  },
  text: { color: "#3f3f46", lineHeight: 20 },
  textStrong: { color: "#18181b", fontWeight: "600", lineHeight: 20 },
  warn: { color: "#b45309", lineHeight: 20 },
});
