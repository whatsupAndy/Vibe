import { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { db } from "@/firebaseConfig";
import { doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";

export default function CleanupTripDetails() {
  const router = useRouter();
  const { id, location, date, volunteers, wasteCollectedKG } = useLocalSearchParams();
  const [newLocation, setNewLocation] = useState(location as string);
  const [newDate, setNewDate] = useState(date as string);
  const [newVolunteers, setNewVolunteers] = useState(volunteers as string);
  const [newWasteCollectedKG, setNewWasteCollectedKG] = useState(wasteCollectedKG as string);
  const [loading, setLoading] = useState(true);

  // 🔹 Henter data fra Firestore hvis det ikke finnes i URL
  useEffect(() => {
    if (!id) {
      console.error("❌ ID mangler, kan ikke hente data!");
      return;
    }

    if (!location || !date || !volunteers || !wasteCollectedKG) {
      console.log("🔄 Henter data fra Firestore...");
      const fetchData = async () => {
        try {
          const docRef = doc(db, "cleanup_trips", id as string);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setNewLocation(data.location || "Ukjent sted");
            setNewDate(data.date || "Ukjent dato");
            setNewVolunteers(String(data.volunteers || 0));
            setNewWasteCollectedKG(String(data.wasteCollectedKG || 0));
          } else {
            console.error("❌ Dokumentet finnes ikke i Firestore");
          }
        } catch (error) {
          console.error("❌ Feil ved henting av data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      setLoading(false);
    }
  }, [id, location, date, volunteers, wasteCollectedKG]);

  const handleUpdate = async () => {
    try {
      const tripRef = doc(db, "cleanup_trips", id as string);
      await updateDoc(tripRef, {
        location: newLocation || "Ukjent sted",
        date: newDate || new Date().toISOString().split("T")[0],
        volunteers: parseInt(newVolunteers) || 0,
        wasteCollectedKG: parseInt(newWasteCollectedKG) || 0,
      });

      Alert.alert("✅ Oppdatert!", "Ryddeaksjonen er oppdatert.");
      router.push("/"); 
    } catch (error) {
      console.error("❌ Feil ved oppdatering:", error);
      Alert.alert("⚠️ Feil", "Kunne ikke oppdatere ryddeaksjonen.");
    }
  };

  const handleDelete = async () => {
    console.log("🗑 Prøver å slette ryddeaksjonen med ID:", id);

    Alert.alert(
      "Bekreft sletting",
      "Er du sikker på at du vil slette denne ryddeaksjonen?",
      [
        { text: "Avbryt", style: "cancel" },
        { 
          text: "🗑 Slett", 
          onPress: async () => {
            try {
              console.log("🚀 Sletter fra Firestore nå...");
              await deleteDoc(doc(db, "cleanup_trips", id as string));
              console.log("✅ Sletting vellykket!");

              Alert.alert("🗑 Slettet!", "Ryddeaksjonen er fjernet.");
              router.push("/");
            } catch (error) {
              console.error("❌ Feil ved sletting:", error);
              Alert.alert("⚠️ Feil", "Kunne ikke slette ryddeaksjonen.");
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Laster...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Rediger ryddeaksjon</Text>

          <Text style={styles.label}>📍 Sted:</Text>
          <TextInput style={styles.input} value={newLocation} onChangeText={setNewLocation} />

          <Text style={styles.label}>📅 Dato:</Text>
          <TextInput style={styles.input} value={newDate} onChangeText={setNewDate} />

          <Text style={styles.label}>👥 Frivillige:</Text>
          <TextInput style={styles.input} value={newVolunteers} onChangeText={setNewVolunteers} keyboardType="numeric" />

          <Text style={styles.label}>🗑️ Innsamlet avfall (kg):</Text>
          <TextInput style={styles.input} value={newWasteCollectedKG} onChangeText={setNewWasteCollectedKG} keyboardType="numeric" />

          <Button title="💾 Lagre endringer" onPress={handleUpdate} />
          <Button title="🗑 Slett" color="red" onPress={handleDelete} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// 🔹 Styling for skjermen
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, 
    justifyContent: "center",
  },
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
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
