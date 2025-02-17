import { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { db } from "@/firebaseConfig";
import { doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";

export default function ActivityDetails() {
  const router = useRouter();
  const { id, type, duration, calories } = useLocalSearchParams();
  const [newType, setNewType] = useState(type as string);
  const [newDuration, setNewDuration] = useState(duration as string);
  const [newCalories, setNewCalories] = useState(calories as string);
  const [loading, setLoading] = useState(true);

  // 🔹 Henter data fra Firestore hvis det ikke finnes i URL
  useEffect(() => {
    if (!id) {
      console.error("❌ ID mangler, kan ikke hente data!");
      return;
    }

    if (!type || !duration || !calories) {
      console.log("🔄 Henter data fra Firestore...");
      const fetchData = async () => {
        try {
          const docRef = doc(db, "activities", id as string);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            setNewType(data.type || "");
            setNewDuration(data.duration || "");
            setNewCalories(data.calories || "");
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
  }, [id, type, duration, calories]);

  const handleUpdate = async () => {
    try {
      const activityRef = doc(db, "activities", id as string);
      await updateDoc(activityRef, {
        type: newType,
        duration: newDuration,
        calories: newCalories,
      });

      Alert.alert("✅ Oppdatert!", "Treningsøkten er endret.");
      router.push("/"); // 🔹 Gå tilbake til hovedsiden
    } catch (error) {
      console.error("❌ Feil ved oppdatering:", error);
      Alert.alert("⚠️ Feil", "Kunne ikke oppdatere økten.");
    }
  };

  const handleDelete = async () => {
    console.log("🗑 Prøver å slette aktiviteten med ID:", id); 
  
    if (Platform.OS === "web") {
      const confirmDelete = window.confirm("Er du sikker på at du vil slette denne treningsøkten?");
      if (!confirmDelete) return;
      try {
        console.log("🚀 Sletter fra Firestore nå...");
        await deleteDoc(doc(db, "activities", id as string));
        console.log("✅ Sletting vellykket!");
  
        alert("🗑 Slettet! Treningsøkten er fjernet."); // Enkel alert på Web
        router.push("/"); 
      } catch (error) {
        console.error("❌ Feil ved sletting:", error);
        alert("⚠️ Feil: Kunne ikke slette økten.");
      }
    } else {
      Alert.alert(
        "Bekreft sletting",
        "Er du sikker på at du vil slette denne treningsøkten?",
        [
          { text: "Avbryt", style: "cancel" },
          { 
            text: "🗑 Slett", 
            onPress: async () => {
              try {
                console.log("🚀 Sletter fra Firestore nå...");
                await deleteDoc(doc(db, "activities", id as string));
                console.log("✅ Sletting vellykket!");
  
                Alert.alert("🗑 Slettet!", "Treningsøkten er fjernet.");
                router.push("/"); 
              } catch (error) {
                console.error("❌ Feil ved sletting:", error);
                Alert.alert("⚠️ Feil", "Kunne ikke slette økten.");
              }
            }
          }
        ]
      );
    }
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
          <Text style={styles.title}>Rediger Treningsøkt</Text>
  
          <Text style={styles.label}>Type:</Text>
          <TextInput style={styles.input} value={newType} onChangeText={setNewType} />
          
          <Text style={styles.label}>Varighet:</Text>
          <TextInput style={styles.input} value={newDuration} onChangeText={setNewDuration} keyboardType="numeric" />
          
          <Text style={styles.label}>Kalorier:</Text>
          <TextInput style={styles.input} value={newCalories} onChangeText={setNewCalories} keyboardType="numeric" />
          
          <Button title="💾 Lagre endringer" onPress={handleUpdate} />
          <Button title="🗑 Slett" color="red" onPress={handleDelete} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// 🔹 Flyttet styles utenfor komponenten for bedre ytelse
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
