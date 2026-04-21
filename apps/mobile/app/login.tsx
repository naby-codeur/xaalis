import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Link, router } from "expo-router";

import { useAuth } from "@/src/hooks/useAuth";

export default function LoginScreen() {
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit() {
    try {
      await login(email, password);
      router.replace("/dashboard");
    } catch {
      // L'erreur est d\u00e9j\u00e0 dans `error`.
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xaliss Manager</Text>
      <Text style={styles.subtitle}>Connectez-vous \u00e0 votre compte</Text>

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
        placeholder="Mot de passe"
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
          {loading ? "Connexion\u2026" : "Se connecter"}
        </Text>
      </Pressable>

      <Link href="/register" style={styles.link}>
        Cr\u00e9er un compte
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    gap: 12,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 16,
  },
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
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  link: {
    textAlign: "center",
    color: "#2563eb",
    marginTop: 12,
    fontSize: 14,
  },
  error: {
    color: "#dc2626",
    fontSize: 14,
    textAlign: "center",
  },
});
