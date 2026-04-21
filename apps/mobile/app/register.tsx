import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";

export default function RegisterScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cr\u00e9er un compte</Text>
      <Text style={styles.subtitle}>
        Formulaire d'inscription \u00e0 impl\u00e9menter.
      </Text>
      <Link href="/login" style={styles.link}>
        Retour \u00e0 la connexion
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
  title: { fontSize: 24, fontWeight: "600", textAlign: "center" },
  subtitle: { fontSize: 14, color: "#6b7280", textAlign: "center" },
  link: { textAlign: "center", color: "#2563eb", marginTop: 12, fontSize: 14 },
});
