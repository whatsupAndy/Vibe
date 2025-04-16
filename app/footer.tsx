import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function FooterBar() {
  const router = useRouter();

  return (
    <View style={styles.footer}>
      <TouchableOpacity onPress={() => router.push("/activity/new-activity")}>
        <Text style={styles.icon}>⊕</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/settings")}>
        <Text style={styles.icon}>⚙️</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#4a4a4c",
    paddingVertical: 12,
    borderTopWidth: 0.3,
    borderColor: "#2c2c2e",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  icon: {
    fontSize: 24,
    color: "#ffffff",
  },
});
