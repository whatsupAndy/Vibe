import { useState } from 'react';
import { 
  View, Text, TextInput, Button, StyleSheet, Alert, Image, TouchableOpacity, 
  KeyboardAvoidingView, ScrollView, Platform, TouchableWithoutFeedback, Keyboard 
} from 'react-native';
import { useRouter } from 'expo-router';
import { db } from '../../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import ReturnBtn from "@/components/ReturnBtn";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function newActivityScreen() {
  const router = useRouter();

  // 🔹 Tilstander for inputfeltene
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [details, setDetails] = useState('');
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
    if (!location || !date || !maxParticipants || !details) {
      Alert.alert('Feil', 'Vennligst fyll ut alle feltene');
      return;
    }

    const newActivity = {
      location: location || 'Ukjent sted',
      date: date || new Date().toISOString().split('T')[0],
      organizer: organizer || 'Ukjent aktivitet',
      participants: [], // 🔹 Sikrer at `participants` alltid er en array
      maxParticipants: parseInt(maxParticipants) || 10, // 🔹 Standard til 10 hvis tomt
      details: details || '',
      imageUrl: image || null,
    };

    try {
      await addDoc(collection(db, 'activities'), newActivity);

      Alert.alert('Suksess!', 'aktiviteten er lagret!', [
        { text: 'OK', onPress: () => router.replace('/') }, // ✅ Bruker `replace` for å unngå tilbake-knapp til denne siden
      ]);
    } catch (error) {
      Alert.alert('Feil', 'Kunne ikke lagre aktiviteten. Prøv igjen.');
      console.error('❌ Feil ved lagring:', error);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.safeArea}>  
          <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Opprett ny aktivitet</Text>

            <TextInput style={styles.input} placeholder="Aktivitet" placeholderTextColor="#999" value={organizer} onChangeText={setOrganizer} />
            <TextInput style={styles.input} placeholder="Sted" placeholderTextColor="#999" value={location} onChangeText={setLocation} />
            <TextInput style={styles.input} placeholder="Dato (YYYY-MM-DD)" placeholderTextColor="#999" value={date} onChangeText={setDate} />
            <TextInput style={styles.input} placeholder="Maks deltagere" placeholderTextColor="#999" value={maxParticipants} onChangeText={setMaxParticipants} keyboardType="numeric" />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Detaljer"
              placeholderTextColor="#999"
              value={details}
              onChangeText={setDetails}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              <Text style={styles.imagePickerText}>📸 Velg bilde fra galleri</Text>
            </TouchableOpacity>

            {image && <Image source={{ uri: image }} style={styles.image} />}

            <Button title="Lagre aktivitet" onPress={handleSave} />
            <ReturnBtn/>
          </ScrollView>
        </SafeAreaView>  
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#2c2c2e',
    flexGrow: 1,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#D4FF00', 
  },
  input: {
    backgroundColor: '#4a4a4c',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.65,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    borderWidth: 0.2,
    borderColor: '#5c5c5e',
    color: '#ffffff', // Sørger for at teksten inni input er hvit
  },
  imagePicker: {
    backgroundColor: '#5c5c5e',
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.65,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
  },
  imagePickerText: {
    fontSize: 16,
    color: '#ffffff',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
    color: '#ffffff',
  },
});

