import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { db } from '../../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';

export default function NewCleanupTripScreen() {
  const router = useRouter();

  // 🔹 Tilstander for inputfeltene
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [participants, setParticipants] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [wasteCollectedKG, setWasteCollectedKG] = useState('');
  const [image, setImage] = useState(null); // 🔹 Lagre valgt bilde

  // 🔹 Funksjon for å velge bilde fra galleriet
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri); // 🔹 Lagre bildeadressen
    }
  };

  // 🔹 Funksjon for å lagre data i Firestore
  const handleSave = async () => {
    if (!location || !date || !participants || !wasteCollectedKG) {
      Alert.alert('Feil', 'Vennligst fyll ut alle feltene');
      return;
    }

    const newCleanupTrip = {
      location: location || 'Ukjent sted',
      date: date || new Date().toISOString().split('T')[0],
      organizer: organizer || 'Ukjent arrangør',
      participants: parseInt(participants) || 0,
      wasteCollectedKG: parseInt(wasteCollectedKG) || 0,
      imageUrl: image || null, // 🔹 Lagre bildet hvis valgt
    };

    try {
      await addDoc(collection(db, 'cleanup_trips'), newCleanupTrip);

      Alert.alert('Suksess!', 'Ryddeaksjonen er lagret!', [
        { text: 'OK', onPress: () => router.push('/') },
      ]);
    } catch (error) {
      Alert.alert('Feil', 'Kunne ikke lagre ryddeaksjonen. Prøv igjen.');
      console.error('❌ Feil ved lagring:', error);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>Opprett ny ryddeaksjon</Text>

          <TextInput style={styles.input} placeholder="Arrangør" value={organizer} onChangeText={setOrganizer} />
          <TextInput style={styles.input} placeholder="Sted" value={location} onChangeText={setLocation} />
          <TextInput style={styles.input} placeholder="Dato & tid (YYYY-MM-DD kl. 00:00)" value={date} onChangeText={setDate} />
          <TextInput style={styles.input} placeholder="Maks deltagere" value={participants} onChangeText={setParticipants} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Oppryddingsmål kg" value={wasteCollectedKG} onChangeText={setWasteCollectedKG} keyboardType="numeric" />

          {/* 🔹 Velg bilde-knapp */}
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            <Text style={styles.imagePickerText}>📸 Velg bilde fra galleri</Text>
          </TouchableOpacity>

          {/* 🔹 Viser bildet hvis valgt */}
          {image && <Image source={{ uri: image }} style={styles.image} />}

          <Button title="Lagre ryddeaksjon" onPress={handleSave} />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

// 🔹 Styling
const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#f8f9fa' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  input: { backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 8, borderWidth: 1, borderColor: '#ccc' },
  imagePicker: { backgroundColor: '#ddd', padding: 15, alignItems: 'center', marginBottom: 10, borderRadius: 8 },
  imagePickerText: { fontSize: 16, color: '#333' },
  image: { width: '100%', height: 200, borderRadius: 10, marginBottom: 10 },
});
