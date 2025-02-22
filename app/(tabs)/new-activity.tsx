import { useState } from 'react';
import { 
  View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity, 
  KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import { useRouter } from 'expo-router';
import { db } from '../../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';

export default function NewCleanupTripScreen() {
  const router = useRouter();

  // 🔹 Tilstander for inputfeltene
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [wasteCollectedKG, setWasteCollectedKG] = useState('');
  const [image, setImage] = useState(null);

  // 🔹 Funksjon for å velge bilde fra galleriet
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // 🔹 Funksjon for å lagre data i Firestore
  const handleSave = async () => {
    if (!location || !date || !maxParticipants || !wasteCollectedKG) {
      Alert.alert('Feil', 'Vennligst fyll ut alle feltene');
      return;
    }

    const newCleanupTrip = {
      location: location || 'Ukjent sted',
      date: date || new Date().toISOString().split('T')[0],
      organizer: organizer || 'Ukjent arrangør',
      participants: [], // 🔹 Sikrer at `participants` alltid er en array
      maxParticipants: parseInt(maxParticipants) || 10, // 🔹 Standard til 10 hvis tomt
      wasteCollectedKG: parseInt(wasteCollectedKG) || 0,
      imageUrl: image || null,
    };

    try {
      await addDoc(collection(db, 'cleanup_trips'), newCleanupTrip);

      Alert.alert('Suksess!', 'Ryddeaksjonen er lagret!', [
        { text: 'OK', onPress: () => router.replace('/') }, // ✅ Bruker `replace` for å unngå tilbake-knapp til denne siden
      ]);
    } catch (error) {
      Alert.alert('Feil', 'Kunne ikke lagre ryddeaksjonen. Prøv igjen.');
      console.error('❌ Feil ved lagring:', error);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Opprett ny ryddeaksjon</Text>

          <TextInput style={styles.input} placeholder="Arrangør" value={organizer} onChangeText={setOrganizer} />
          <TextInput style={styles.input} placeholder="Sted" value={location} onChangeText={setLocation} />
          <TextInput style={styles.input} placeholder="Dato (YYYY-MM-DD)" value={date} onChangeText={setDate} />
          <TextInput style={styles.input} placeholder="Maks deltagere" value={maxParticipants} onChangeText={setMaxParticipants} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Oppryddingsmål (kg)" value={wasteCollectedKG} onChangeText={setWasteCollectedKG} keyboardType="numeric" />

          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            <Text style={styles.imagePickerText}>📸 Velg bilde fra galleri</Text>
          </TouchableOpacity>

          {image && <Image source={{ uri: image }} style={styles.image} />}

          <Button title="Lagre ryddeaksjon" onPress={handleSave} />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f8f9fa' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  input: { backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ccc' },
  imagePicker: { backgroundColor: '#ddd', padding: 15, alignItems: 'center', marginBottom: 10, borderRadius: 8 },
  imagePickerText: { fontSize: 16, color: '#333' },
  image: { width: '100%', height: 200, borderRadius: 10, marginBottom: 10 },
});
