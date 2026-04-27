import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { clearAuthSession } from "@/src/services/api";
import { getAuthenticatedUser } from "@/src/store/auth.store";

export default function SettingsScreen() {
  const user = getAuthenticatedUser();

  async function handleLogout() {
    await clearAuthSession();
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Parametres</Text>
      <View style={styles.card}>
        <Text style={styles.text}>
          Compte: {user?.email ?? "inconnu"}
        </Text>
        <Text style={styles.text}>Organisation: {user?.organizationId ?? "n/a"}</Text>
        <Pressable style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Se deconnecter</Text>
        </Pressable>
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
  text: { color: "#3f3f46", lineHeight: 20 },
  button: {
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#d4d4d8",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  buttonText: { color: "#18181b", fontWeight: "600" },
});
