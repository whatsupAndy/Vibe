import { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { useRouter } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from "react-native";
import Logo from "@/assets/images/logo.png";



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

  <Text style={styles.title}>Vibe</Text>
  return (
    
      <View style={styles.container}>
      <Image source={Logo} style={styles.logo} />
      <Text style={styles.title}>Logg inn</Text>

      <TextInput style={styles.input} placeholder="E-post" value={email} placeholderTextColor="#999" onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Passord" value={password} placeholderTextColor="#999" onChangeText={setPassword} secureTextEntry />

      <Button title="Logg inn" onPress={handleLogin} />
      <Button title="Registrer ny bruker" onPress={() => router.push("/register")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#2c2c2e", // mørk bakgrunn
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#D4FF00", // neon-gul stil
  },
  input: {
    backgroundColor: "#4a4a4c", // mørkt input-felt
    borderWidth: 1,
    borderColor: "#555", // litt kontrast
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    color: "#fff", // tekstfarge inni input-felt
  },
  logo: {
    width: 160,
    height: 60,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 30,
  },
  
});

