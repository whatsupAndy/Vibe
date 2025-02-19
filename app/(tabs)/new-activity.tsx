import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { db } from '../../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

export default function NewCleanupTripScreen() {
  const router = useRouter();

  // 🔹 Tilstander for inputfeltene
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [volunteers, setVolunteers] = useState('');
  const [wasteCollectedKG, setWasteCollectedKG] = useState('');

  // 🔹 Funksjon for å lagre data i Firestore
  const handleSave = async () => {
    if (!location || !date || !volunteers || !wasteCollectedKG) {
      Alert.alert('Feil', 'Vennligst fyll ut alle feltene');
      return;
    }

    // 📌 Sikrer at alle verdier er definert før lagring
    const newCleanupTrip = {
      location: location || "Ukjent sted",
      date: date || new Date().toISOString().split("T")[0], // Setter dagens dato hvis tom
      volunteers: parseInt(volunteers) || 0,
      wasteCollectedKG: parseInt(wasteCollectedKG) || 0,
    };

    try {
      await addDoc(collection(db, "cleanup_trips"), newCleanupTrip);

      Alert.alert('Suksess!', 'Ryddeaksjonen er lagret!', [
        { text: "OK", onPress: () => router.push('/') }
      ]);
    } catch (error) {
      Alert.alert('Feil', 'Kunne ikke lagre ryddeaksjonen. Prøv igjen.');
      console.error("❌ Feil ved lagring:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Loggfør ny ryddeaksjon</Text>

      <TextInput
        style={styles.input}
        placeholder="Sted"
        value={location}
        onChangeText={setLocation}
      />

      <TextInput
        style={styles.input}
        placeholder="Dato (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
      />

      <TextInput
        style={styles.input}
        placeholder="Antall frivillige"
        value={volunteers}
        onChangeText={setVolunteers}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="Innsamlet avfall (kg)"
        value={wasteCollectedKG}
        onChangeText={setWasteCollectedKG}
        keyboardType="numeric"
      />

      <Button title="Lagre ryddeaksjon" onPress={handleSave} />
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

