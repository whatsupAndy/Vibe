import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { db } from "@/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

export default function EditActivityScreen() {
  const router = useRouter();
  const { id, type, duration, calories } = useLocalSearchParams(); // 🔹 Henter parametere fra URL
  const [newType, setNewType] = useState(type as string);
  const [newDuration, setNewDuration] = useState(duration as string);
  const [newCalories, setNewCalories] = useState(calories as string);

  const handleUpdate = async () => {
    try {
      const activityRef = doc(db, "activities", id as string);
      await updateDoc(activityRef, {
        type: newType,
        duration: newDuration,
        calories: newCalories,
      });

      Alert.alert("Oppdatert!", "Treningsøkten er endret.");
      router.push("/"); // 🔹 Gå tilbake til hovedsiden
    } catch (error) {
      console.error("❌ Feil ved oppdatering:", error);
      Alert.alert("Feil", "Kunne ikke oppdatere økten.");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Type:</Text>
      <TextInput value={newType} onChangeText={setNewType} />
      
      <Text>Varighet:</Text>
      <TextInput value={newDuration} onChangeText={setNewDuration} keyboardType="numeric" />
      
      <Text>Kalorier:</Text>
      <TextInput value={newCalories} onChangeText={setNewCalories} keyboardType="numeric" />
      
      <Button title="Lagre endringer" onPress={handleUpdate} />
    </View>
  );
}
