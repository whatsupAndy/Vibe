import { View, Text, StyleSheet, Pressable } from "react-native";

type CardProps = {
  title: string;
  description: string;
  value: string;
  onPress: () => void;
  onDelete: () => void;
};

export default function Card({ title, description, value, onPress, onDelete }: CardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
      <Text>{description}</Text>
      <Text>{value}</Text>
      <Pressable onPress={onDelete} style={styles.deleteButton}>
        <Text style={styles.deleteText}>🗑 Slett</Text>
      </Pressable>
    </Pressable>
  );
}


const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  deleteButton: {
    marginTop: 10,
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
    alignItems: "center",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  }
});
