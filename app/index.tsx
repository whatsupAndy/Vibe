import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Pressable, RefreshControl, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { db, auth } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from "firebase/auth";

// 🔹 Definer type for ryddeaksjoner
type CleanupTrip = {
  id: string;
  location: string;
  date: string;
  wasteCollectedKG: number;
  participants: number;
};

export default function HomeScreen() {
  const router = useRouter();
  const [cleanupTrips, setCleanupTrips] = useState<CleanupTrip[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("🔍 Brukerstatus oppdatert:", currentUser ? currentUser.email : "Ingen bruker logget inn");
      setUser(currentUser);

      if (currentUser) {
        fetchCleanupTrips();
      }
    });

    return () => unsubscribe();
  }, []);

  // 🔹 Henter ryddeaksjoner fra Firestore
  const fetchCleanupTrips = async () => {
    if (!auth.currentUser) {
      console.log("⚠️ Ingen bruker logget inn. Kan ikke hente data.");
      return;
    }

    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "cleanup_trips"));
      const fetchedTrips: CleanupTrip[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        location: doc.data()?.location || "Ukjent sted",
        date: doc.data()?.date || "Ukjent dato",
        participants: doc.data()?.participants || 0,
        wasteCollectedKG: doc.data()?.wasteCollectedKG || 0,
      }));

      console.log("📥 Hentet ryddeaksjoner:", fetchedTrips);
      setCleanupTrips(fetchedTrips);
    } catch (error) {
      console.error("❌ Firebase-feil ved henting av data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 🔹 Trekker ned for å oppdatere
  const onRefresh = () => {
    setRefreshing(true);
    fetchCleanupTrips();
  };

  // 🔹 Logg ut bruker
  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("✅ Logget ut", "Du er nå logget ut.");
      router.replace("/login");
    } catch (error) {
      Alert.alert("Feil", "Kunne ikke logge ut. Prøv igjen.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Alle Ryddeaksjoner</Text>
      {user ? (
        <FlatList
        data={cleanupTrips}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push(`/activity/${item.id}`)}>
              <View style={styles.card}>
                <Text style={styles.activityType}>📍 {item.location}</Text>
                <Text>📅 Dato: {item.date}</Text>
                <Text>🗑️ Oppryddingsmål: {item.wasteCollectedKG}kg </Text>
                <Text>👥 Maks deltakere: {item.participants}</Text>
              </View>
            </Pressable>
          )}
          // 🔹 Plasserer "Ny ryddeaksjon" som en del av listen
          ListHeaderComponent={() => (
            <Button title="➕ Ny ryddeaksjon" onPress={() => router.push('/new-activity')} />
          )}
          // 🔹 Plasserer "Logg ut" nederst i listen
          ListFooterComponent={() => (
            <Button title="🚪 Logg ut" onPress={handleLogout} color="red" />
          )}
        />
      ) : (
        <View>
          <Text>⚠️ Du må logge inn for å se ryddeaksjoner.</Text>
          <Button title="🔑 Logg inn" onPress={() => router.replace("/login")} />
        </View>
      )}
    </View>
  );
  
}

// 🔹 Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3
  },
  activityType: {
    fontSize: 18,
    fontWeight: 'bold'
  }
});
