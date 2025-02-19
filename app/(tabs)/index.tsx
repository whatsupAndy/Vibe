import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Pressable, Alert, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { db } from '../../firebaseConfig';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';

export default function HomeScreen() {
  const router = useRouter();
  const [cleanupTrips, setCleanupTrips] = useState<{ id: string; location: string; date: string; volunteers: number; wasteCollectedKG: number }[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔹 Henter ryddeaksjoner fra Firestore
  const fetchCleanupTrips = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "cleanup_trips"));
      const fetchedTrips = querySnapshot.docs.map(doc => ({
        id: doc.id,
        location: doc.data()?.location || "Ukjent sted",
        date: doc.data()?.date || "Ukjent dato",
        volunteers: doc.data()?.volunteers || 0,
        wasteCollectedKG: doc.data()?.wasteCollectedKG || 0,
      }));

      console.log("📥 Hentet ryddeaksjoner:", fetchedTrips);
      setCleanupTrips(fetchedTrips);
    } catch (error) {
      console.error("❌ Firebase-feil ved henting av data:", error.code, error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchCleanupTrips();
  };

  useEffect(() => {
    fetchCleanupTrips();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dine ryddeaksjoner</Text>

      <Button title="➕ Ny ryddeaksjon" onPress={() => router.push('/new-activity')} />

      {loading ? <Text>Laster...</Text> : (
        <FlatList
          data={cleanupTrips}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push(`/activity/${item.id}`)}>
              <View style={styles.card}>
                <Text style={styles.activityType}>📍 {item.location}</Text>
                <Text>📅 Dato: {item.date}</Text>
                <Text>👥 Frivillige: {item.volunteers}</Text>
                <Text>🗑️ Innsamlet avfall: {item.wasteCollectedKG} kg</Text>
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

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
