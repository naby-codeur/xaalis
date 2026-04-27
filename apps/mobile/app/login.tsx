import { useEffect, useState } from "react";
import { Link, router } from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { useAuth } from "@/src/hooks/useAuth";
import { tryAutoDevBypassLogin } from "@/src/services/api";

const enableDevBypass =
  process.env.EXPO_PUBLIC_DEV_AUTH_BYPASS === "1" ||
  process.env.EXPO_PUBLIC_DEV_AUTH_BYPASS?.toLowerCase() === "true";

export default function LoginScreen() {
  const { login, devLogin, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [devAutoPending, setDevAutoPending] = useState(enableDevBypass);

  useEffect(() => {
    if (!enableDevBypass) return;
    let mounted = true;
    void (async () => {
      const ok = await tryAutoDevBypassLogin();
      if (!mounted) return;
      if (ok) {
        router.replace("/(app)/(tabs)/dashboard");
        return;
      }
      setDevAutoPending(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function handleSubmit() {
    try {
      await login(email, password);
      router.replace("/(app)/(tabs)/dashboard");
    } catch {
      // L'erreur est deja dans `error`.
    }
  }

  async function handleDevLogin() {
    try {
      await devLogin();
      router.replace("/(app)/(tabs)/dashboard");
    } catch {
      // L'erreur est deja dans `error`.
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      <View style={styles.container}>
        <Text style={styles.title}>Xaliss Manager</Text>
        <Text style={styles.subtitle}>Connectez-vous a votre compte</Text>

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
            {loading ? "Connexion..." : "Se connecter"}
          </Text>
        </Pressable>

        {enableDevBypass ? (
          <Pressable
            style={[styles.devButton, loading && styles.buttonDisabled]}
            onPress={handleDevLogin}
            disabled={loading}
          >
            <Text style={styles.devButtonText}>Entrer en mode dev</Text>
          </Pressable>
        ) : null}

        <Link href="/register" style={styles.link}>
          Creer un compte
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
  devButton: {
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#a1a1aa",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  devButtonText: {
    color: "#27272a",
    fontSize: 14,
    fontWeight: "500",
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
