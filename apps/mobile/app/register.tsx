import { useState } from "react";
import { Link, router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

import { useAuth } from "@/src/hooks/useAuth";

export default function RegisterScreen() {
  const { register, loading, error } = useAuth();
  const [organizationName, setOrganizationName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit() {
    try {
      await register({
        organizationName,
        name: name.trim() || undefined,
        email,
        password,
      });
      router.replace("/(app)/(tabs)/dashboard");
    } catch {
      // L'erreur est deja dans `error`.
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Creer un compte</Text>
        <Text style={styles.subtitle}>
          Creez votre organisation et votre compte administrateur.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Nom de l'organisation"
          value={organizationName}
          onChangeText={setOrganizationName}
        />
        <TextInput
          style={styles.input}
          placeholder="Votre nom (optionnel)"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Mot de passe (8+)"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Creation..." : "Creer le compte"}
          </Text>
        </Pressable>

        <Link href="/login" style={styles.link}>
          Retour a la connexion
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  container: {
    padding: 24,
    gap: 12,
  },
  title: { fontSize: 24, fontWeight: "600", textAlign: "center", marginBottom: 4 },
  subtitle: { fontSize: 14, color: "#6b7280", textAlign: "center", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#d4d4d8",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#18181b",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "500" },
  link: { textAlign: "center", color: "#2563eb", marginTop: 12, fontSize: 14 },
  error: { color: "#dc2626", fontSize: 14, textAlign: "center" },
});
