import { Pressable, Text, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";

export default function ReturnBtn() {
  const router = useRouter();

  return (
    <Pressable style={styles.button} onPress={() => router.push("/")}>
      <Text style={styles.buttonText}>⬅️ Tilbake</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#4a4a4c", // Mørk boks
    paddingVertical: 18,
    paddingHorizontal: 18,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.65,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "#5c5c5e", // Diskret kant
    borderWidth: 1,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});