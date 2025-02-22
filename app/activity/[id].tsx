import { Key, useEffect, useState } from "react";
import { View, Text, Button, Alert, StyleSheet, ScrollView, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { db, auth } from "@/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function CleanupTripDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [trip, setTrip] = useState<any>(null);
  const [user, setUser] = useState(auth.currentUser);
  const [participantUsernames, setParticipantUsernames] = useState<{ [uid: string]: string }>({});

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
          const tripData = docSnap.data();
          setTrip(tripData);
  
          // 🔹 Kall fetchUsernames hvis det finnes deltakere
          if (tripData.participants && tripData.participants.length > 0) {
            await fetchUsernames(tripData.participants);
          }
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
  }, [id]); // 🚀 Kjør kun når ID endres
  

  // 🔹 Henter brukernavnene for alle påmeldte deltakere basert på UID
  const fetchUsernames = async (userIds: string[]) => {
    let usernames: { [uid: string]: string } = {};
  
    try {
      const userDocs = await Promise.all(
        userIds.map(async (uid) => {
          const userRef = doc(db, "users", uid);
          const userDoc = await getDoc(userRef);
          return userDoc.exists() ? { uid, username: userDoc.data().username } : { uid, username: "Ukjent bruker" };
        })
      );
  
      userDocs.forEach(({ uid, username }) => {
        usernames[uid] = username;
      });
  
      setParticipantUsernames(usernames);
    } catch (error) {
      console.error("❌ Feil ved henting av brukernavn:", error);
    }
  };
  
  

  if (loading) {
    return <Text>⏳ Laster detaljer...</Text>;
  }

  if (!trip) {
    return <Text>⚠️ Kunne ikke finne ryddeaksjonen.</Text>;
  }

  const { location, date, time, participants = [], wasteCollectedKG, imageUrl, organizer } = trip;
  const isFull = participants.length >= (trip?.maxParticipants ?? 0);
  const isSignedUp = Array.isArray(participants) && participants.includes(user?.uid);

  const handleSignUp = async () => {
    if (!user) {
      Alert.alert("⚠️ Du må være logget inn for å melde deg på.");
      return;
    }
  
    if (!trip || !Array.isArray(trip.participants)) {
      Alert.alert("❌ Feil", "Ugyldige data. Prøv igjen senere.");
      return;
    }
  
    if (trip.participants.includes(user.uid)) {
      Alert.alert("✅ Du er allerede påmeldt.");
      return;
    }
  
    if (trip.participants.length >= (trip.maxParticipants || 10)) { // 🔹 Sjekker om aksjonen er full
      Alert.alert("⚠️ Denne ryddeaksjonen er full.");
      return;
    }
  
    try {
      const tripRef = doc(db, "cleanup_trips", id as string);
      const updatedParticipants = [...trip.participants, user.uid];
  
      await updateDoc(tripRef, { participants: updatedParticipants });
      setTrip((prev: any) => ({ ...prev, participants: updatedParticipants }));
  
      fetchUsernames(updatedParticipants); // Oppdaterer brukernavnene
      Alert.alert("🎉 Påmeldt!", "Du er nå påmeldt ryddeaksjonen.");
    } catch (error) {
      console.error("❌ Feil ved påmelding:", error);
      Alert.alert("⚠️ Kunne ikke melde deg på. Prøv igjen.");
    }
  };
  
  
  

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
        participants.map((uid: string | number, index: Key | null | undefined) => (
          <Text key={index} style={styles.participant}>
            👤 {participantUsernames[uid] || "Ukjent bruker"}
          </Text>
        ))
      ) : (
        <Text style={styles.info}>Ingen deltakere ennå</Text>
      )}

      {!isSignedUp && !isFull && <Button title="✅ Meld deg på" onPress={handleSignUp} color="green" />}
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
