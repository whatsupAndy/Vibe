import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { db } from '../../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function NewActivityScreen() {
  const router = useRouter();

  // 🔹 Tilstander for inputfeltene
  const [activityType, setActivityType] = useState('');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');

  // 🔹 Funksjon for å lagre data i Firestore
  const handleSave = async () => {
    if (!activityType || !duration || !calories) {
      Alert.alert('Feil', 'Vennligst fyll ut alle feltene');
      return;
    }
  
    try {
      await addDoc(collection(db, "activities"), {
        type: activityType,
        duration: duration + " min",
        calories: calories + " kcal"
      });
  
      Alert.alert('Suksess!', 'Treningsøkten er lagret!', [
        { text: "OK", onPress: () => router.push('/') } // Gå tilbake først etter at brukeren trykker OK
      ]);
    } catch (error) {
      Alert.alert('Feil', 'Kunne ikke lagre økten. Prøv igjen.');
      console.error("Feil ved lagring:", error);
    }
  };
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Loggfør ny treningsøkt</Text>

      <TextInput
        style={styles.input}
        placeholder="Type aktivitet (f.eks. løping)"
        value={activityType}
        onChangeText={setActivityType}
      />

      <TextInput
        style={styles.input}
        placeholder="Varighet (minutter)"
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Kalorier forbrent"
        value={calories}
        onChangeText={setCalories}
        keyboardType="numeric"
      />

      <Button title="Lagre økt" onPress={handleSave} />
    </View>
  );
}

// 🔹 Styling for skjermen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});
