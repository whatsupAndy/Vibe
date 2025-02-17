import { Pressable, Text, StyleSheet } from "react-native";

type CustomButtonProps = {
  title: string;
  onPress: () => void;
  color?: string;
};

export default function CustomButton({ title, onPress, color = "blue" }: CustomButtonProps) {
  return (
    <Pressable style={[styles.button, { backgroundColor: color }]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 5,
  },
  text: {
    color: "#fff",
    fontWeight: "bold",
  },
});
