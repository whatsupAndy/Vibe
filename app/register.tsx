import { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { useRouter } from "expo-router";

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Suksess!", "Bruker opprettet. Du kan nå logge inn.");
      router.replace("/login");
    } catch (error) {
      Alert.alert("Feil", "Kunne ikke opprette bruker. Prøv igjen.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrer ny bruker</Text>

      <TextInput style={styles.input} placeholder="E-post" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Passord" value={password} onChangeText={setPassword} secureTextEntry />

      <Button title="Registrer" onPress={handleRegister} />
      <Button title="Tilbake til innlogging" onPress={() => router.replace("/login")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 5 },
});
