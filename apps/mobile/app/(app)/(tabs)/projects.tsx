import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { api } from "@/src/services/api";

export default function ProjectsScreen() {
  const [projects, setProjects] = useState<
    {
      id: string;
      name: string;
      description: string | null;
      createdAt: string;
    }[]
  >([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const response = await api.projects.list();
        if (!mounted) return;
        setProjects(response.data);
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
      <Text style={styles.title}>Projets</Text>
      <View style={styles.card}>
        {error ? <Text style={styles.warn}>{error}</Text> : null}
        {!error && projects.length === 0 ? (
          <Text style={styles.text}>Aucun projet disponible.</Text>
        ) : null}
        {projects.map((project) => (
          <View key={project.id} style={styles.row}>
            <Text style={styles.textStrong}>{project.name}</Text>
            <Text style={styles.text}>
              {project.description?.trim() || "Sans description"}
            </Text>
            <Text style={styles.meta}>
              Cree le {new Date(project.createdAt).toLocaleDateString("fr-FR")}
            </Text>
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
  meta: { color: "#71717a", fontSize: 12, marginTop: 4 },
  warn: { color: "#b45309", lineHeight: 20 },
});
