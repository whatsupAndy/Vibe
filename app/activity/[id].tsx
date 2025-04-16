import { Key, useEffect, useState } from "react";
import { View, Text, Button, Alert, StyleSheet, ScrollView, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { db, auth } from "@/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import ReturnBtn from "@/components/ReturnBtn";
import { SafeAreaView } from 'react-native-safe-area-context';


export default function CleanupActivityDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState<any>(null);
  const [user, setUser] = useState(auth.currentUser);
  const [participantUsernames, setParticipantUsernames] = useState<{ [uid: string]: string }>({});

  useEffect(() => {
    if (!id) {
      console.error("❌ Ingen ID spesifisert!");
      return;
    }
  
    const fetchData = async () => {
      try {
        const docRef = doc(db, "activities", id as string);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          const activityData = docSnap.data();
          setActivity(activityData);
  
          // 🔹 Kall fetchUsernames hvis det finnes deltakere
          if (activityData.participants && activityData.participants.length > 0) {
            await fetchUsernames(activityData.participants);
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

  if (!activity) {
    return <Text>⚠️ Kunne ikke finne aktiviteten.</Text>;
  }

  const { location, date, time, participants = [], details, imageUrl, organizer } = activity;
  const isFull = participants.length >= (activity?.maxParticipants ?? 0);
  const isSignedUp = Array.isArray(participants) && participants.includes(user?.uid);

  const handleSignUp = async () => {
    if (!user) {
      Alert.alert("⚠️ Du må være logget inn for å melde deg på.");
      return;
    }
  
    if (!activity || !Array.isArray(activity.participants)) {
      Alert.alert("❌ Feil", "Ugyldige data. Prøv igjen senere.");
      return;
    }
  
    if (activity.participants.includes(user.uid)) {
      Alert.alert("✅ Du er allerede påmeldt.");
      return;
    }
  
    if (activity.participants.length >= (activity.maxParticipants || 10)) { // 🔹 Sjekker om aktiviteten er full
      Alert.alert("⚠️ Denne aktiviteten er full.");
      return;
    }
  
    try {
      const activityRef = doc(db, "activities", id as string);
      const updatedParticipants = [...activity.participants, user.uid];
  
      await updateDoc(activityRef, { participants: updatedParticipants });
      setActivity((prev: any) => ({ ...prev, participants: updatedParticipants }));
  
      fetchUsernames(updatedParticipants); // Oppdaterer brukernavnene
      Alert.alert("🎉 Påmeldt!", "Du er nå påmeldt aktiviteten.");
    } catch (error) {
      console.error("❌ Feil ved påmelding:", error);
      Alert.alert("⚠️ Kunne ikke melde deg på. Prøv igjen.");
    }
  };
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {imageUrl ? <Image source={{ uri: imageUrl }} style={styles.image} /> : <Text>📷 Ingen bilde tilgjengelig</Text>}

        <Text style={styles.title}>Detaljer for aktivitet</Text>

        <Text style={styles.label}>👤 Aktivitet:</Text>
        <Text style={styles.info}>{organizer}</Text>

        <Text style={styles.label}>📍 Sted:</Text>
        <Text style={styles.info}>{location}</Text>

        <Text style={styles.label}>🗓️ Dato & tid</Text>
        <Text style={styles.info}>{date} kl.{time}</Text>

        <Text style={styles.label}>Detaljer:</Text>
        <Text style={[styles.info, styles.detailsText]}>{details}</Text>

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
        {isFull && !isSignedUp && <Text style={styles.fullMessage}>⚠️ Denne aktiviteten er full.</Text>}

        <ReturnBtn/>
      </ScrollView>
    </SafeAreaView>
  );
}

// 🔹 Styling
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#2c2c2e",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#D4FF00",
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
    color: "#ffffff",
  },
  info: {
    backgroundColor: "#4a4a4c", 
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    borderWidth: 0.2,
    shadowColor: '#000',
    shadowOpacity: 0.65,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    borderColor: "#5c5c5e",
    color: "#ffffff",
  },
  participant: {
    fontSize: 16,
    marginBottom: 5,
    color: "#ffffff",
  },
  fullMessage: {
    color: "red",
    fontWeight: "bold",
    marginVertical: 10,
  },
  detailsText: {
    minHeight: 100,
    textAlignVertical: "top",
    color: "#ffffff",
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#2c2c2e',
  },
  
  
});
