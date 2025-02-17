import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Pressable, Alert, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { db } from '../../firebaseConfig';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { APP_CONFIG } from '@/config';

export default function HomeScreen() {
  const router = useRouter();
  const [activities, setActivities] = useState<{ id: string; type: string; duration: string; calories: string }[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const [loading, setLoading] = useState(true);

  // 🔹 Funksjon for å hente treningsøkter fra Firestore
  const fetchActivities = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "activities"));
      const fetchedActivities = querySnapshot.docs.map(doc => ({
        id: doc.id,
        type: doc.data().type || "Ukjent type",
        duration: doc.data().duration || "0 min",
        calories: doc.data().calories || "0 kcal",
      }));
  
      console.log("📥 Hentet aktiviteter:", fetchedActivities);  // Debugging
      setActivities(fetchedActivities);
    } catch (error) {
      console.error("❌ Feil ved henting av data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  const onRefresh = () => {
    setRefreshing(true);
    fetchActivities();
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dine Treningsøkter</Text>

      <Button title="➕ Ny aktivitet" onPress={() => router.push('/new-activity')} />

      {loading ? <Text>Laster...</Text> : (
        <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`/activity/${item.id}`)}>
            <View style={styles.card}>
              <Text style={styles.activityType}>{item.type}</Text>
              <Text>Varighet: {item.duration}</Text>
              <Text>Kalorier: {item.calories}</Text>
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
