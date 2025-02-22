import { useEffect, useState } from "react";
import { View, Text, Button, Alert, StyleSheet, ScrollView, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { db, auth } from "@/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function CleanupTripDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [trip, setTrip] = useState(null);
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    if (!id) {
      console.error("❌ Ingen ID spesifisert!");
      return;
    }

    const fetchData = async () => {
      try {
        const docRef = doc(db, "cleanup_trips", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setTrip(docSnap.data());
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
  }, [id]);

  if (loading) {
    return <Text>⏳ Laster detaljer...</Text>;
  }

  if (!trip) {
    return <Text>⚠️ Kunne ikke finne ryddeaksjonen.</Text>;
  }

  const { 
    location, 
    date, 
    time, 
    participants = [],  // ✅ Sikrer at `participants` er en array
    wasteCollectedKG, 
    imageUrl, 
    organizer 
  } = trip;
  
  const isFull = participants.length >= trip.maxParticipants;
  const isSignedUp = Array.isArray(participants) && participants.includes(user?.email);
  

  const handleSignUp = async () => {
    if (!user) {
      Alert.alert("⚠️ Du må være logget inn for å melde deg på.");
      return;
    }
  
    // ✅ Sikrer at `participants` alltid er en array
    const currentParticipants = Array.isArray(trip.participants) ? trip.participants : [];
  
    if (currentParticipants.includes(user.email)) {
      Alert.alert("✅ Du er allerede påmeldt.");
      return;
    }
  
    if (currentParticipants.length >= trip.maxParticipants) {
      Alert.alert("⚠️ Ingen tilgjengelige plasser.");
      return;
    }
  
    try {
      const tripRef = doc(db, "cleanup_trips", id as string);
      const updatedParticipants = [...currentParticipants, user.email];
  
      await updateDoc(tripRef, { participants: updatedParticipants });
  
      setTrip((prev) => ({ ...prev, participants: updatedParticipants }));
      Alert.alert("🎉 Påmeldt!", "Du er nå påmeldt ryddeaksjonen.");
    } catch (error) {
      console.error("❌ Feil ved påmelding:", error);
      Alert.alert("⚠️ Kunne ikke melde deg på. Prøv igjen.");
    }
  };
  

  const handleCancelSignUp = async () => {
    if (!user || !isSignedUp) {
      Alert.alert("⚠️ Du er ikke påmeldt.");
      return;
    }

    try {
      const tripRef = doc(db, "cleanup_trips", id as string);
      const updatedParticipants = participants.filter((email) => email !== user.email);

      await updateDoc(tripRef, { participants: updatedParticipants });

      setTrip((prev) => ({ ...prev, participants: updatedParticipants }));
      Alert.alert("❌ Påmelding kansellert", "Du har meldt deg av ryddeaksjonen.");
    } catch (error) {
      console.error("❌ Feil ved avmelding:", error);
      Alert.alert("⚠️ Kunne ikke melde deg av. Prøv igjen.");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 🔹 Viser bilde hvis det finnes */}
      {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.image} /> : <Text>📷 Ingen bilde tilgjengelig</Text>}

      <Text style={styles.title}>Detaljer for ryddeaksjon</Text>

      <Text style={styles.label}>👤 Arrangør:</Text>
      <Text style={styles.info}>{organizer}</Text>

      <Text style={styles.label}>📍 Sted:</Text>
      <Text style={styles.info}>{location}</Text>

      <Text style={styles.label}>📅 Dato & tid</Text>
      <Text style={styles.info}>{date} kl.{time}</Text>

      <Text style={styles.label}>🗑️ Oppryddingsmål:</Text>
      <Text style={styles.info}>{wasteCollectedKG} kg</Text>

      <Text style={styles.label}>✅ Påmeldte deltakere:</Text>
      {participants.length > 0 ? (
        participants.map((p, index) => (
          <Text key={index} style={styles.participant}>👤 {p}</Text>
        ))
      ) : (
        <Text style={styles.info}>Ingen deltakere ennå</Text>
      )}

      {/* 🔹 Påmeldingsknapp */}
      {!isSignedUp && !isFull && <Button title="✅ Meld deg på" onPress={handleSignUp} color="green" />}

      {/* 🔹 Avmeldingsknapp */}
      {isSignedUp && <Button title="❌ Meld deg av" onPress={handleCancelSignUp} color="red" />}

      {/* 🔹 Viser melding hvis aksjonen er full */}
      {isFull && !isSignedUp && <Text style={styles.fullMessage}>⚠️ Denne aksjonen er full.</Text>}

      <Button title="🔙 Tilbake" onPress={() => router.push("/")} />
    </ScrollView>
  );
}

// 🔹 Styling
const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#f8f9fa" },
  image: { width: "100%", height: 200, borderRadius: 10, marginBottom: 10 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  label: { fontWeight: "bold", marginTop: 10 },
  info: { backgroundColor: "#fff", padding: 10, borderRadius: 5, marginBottom: 10, borderWidth: 1, borderColor: "#ccc" },
  participant: { fontSize: 16, marginBottom: 5 },
  fullMessage: { color: "red", fontWeight: "bold", marginVertical: 10 },
});
