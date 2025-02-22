import { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/"); // 🔹 Send brukeren tilbake til hovedsiden
    } catch (error) {
      Alert.alert("Feil", "Kunne ikke logge inn. Sjekk e-posten og passordet.");
    }
  };

  <Text style={styles.title}>PaddleForOcean</Text>
  return (
      <View style={styles.container}>
      <Text style={styles.title}>Logg inn</Text>

      <TextInput style={styles.input} placeholder="E-post" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Passord" value={password} onChangeText={setPassword} secureTextEntry />

      <Button title="Logg inn" onPress={handleLogin} />
      <Button title="Registrer ny bruker" onPress={() => router.push("/register")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
});
