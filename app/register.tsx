import { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebaseConfig";
import { useRouter } from "expo-router";
import { doc, setDoc } from "firebase/firestore"; // 🔹 Importer Firestore-funksjoner

export default function RegisterScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState(""); // 🔹 Ny tilstand for brukernavn

  const handleRegister = async () => {
    if (!email || !password || !username) {
      Alert.alert("Feil", "Vennligst fyll ut alle feltene.");
      return;
    }

    try {
      // 🔹 Opprett bruker i Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🔹 Lagre brukernavn i Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        username: username, // 🔹 Lagre brukernavn med UID
      });

      Alert.alert("Suksess!", "Bruker opprettet. Du kan nå logge inn.");
      router.replace("/login");
    } catch (error) {
      Alert.alert("Feil", "Kunne ikke opprette bruker. Prøv igjen.");
      console.error("❌ Registreringsfeil:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput style={styles.input} placeholder="Brukernavn" value={username} onChangeText={setUsername} />
      <TextInput style={styles.input} placeholder="E-post" value={email} onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Passord" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Registrer" onPress={handleRegister} />
    </View>
  );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: "center",
      backgroundColor: "#f8f9fa",
    },
    title: {
      fontSize: 22,
      fontWeight: "bold",
      marginBottom: 15,
    },
    input: {
      backgroundColor: "#fff",
      padding: 10,
      marginBottom: 10,
      borderRadius: 5,
      borderWidth: 1,
      borderColor: "#ccc",
    },
  });
  