import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import ReturnBtn from "@/components/ReturnBtn";


export default function SettingsScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("✅ Logget ut", "Du er nå logget ut.");
      router.replace("/login");
    } catch (error) {
      Alert.alert("Feil", "Kunne ikke logge ut. Prøv igjen.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⚙️ Innstillinger</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Logg ut</Text>
      </TouchableOpacity>
      <ReturnBtn/>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2c2c2e",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    color: "#fff",
    marginBottom: 100,
  },
  logoutButton: {
    backgroundColor: "#ff3b30",
    padding: 18,
    borderRadius: 8,
    marginBottom:15,
    shadowColor: '#000',
    shadowOpacity: 0.65,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
