import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Pressable, RefreshControl, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { db, auth } from '../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from "firebase/auth";
import FooterBar from './footer';
import { SafeAreaView } from 'react-native-safe-area-context';

type Activity = {
  id: string;
  location: string;
  date: string;
  organizer: string;
  details: string;
  participants: number;
};

export default function HomeScreen() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("🔍 Brukerstatus oppdatert:", currentUser ? currentUser.email : "Ingen bruker logget inn");
      setUser(currentUser);

      if (currentUser) {
        fetchActivities();
      }
    });

    return () => unsubscribe();
  }, []);

  // 🔹 Henter aktiviteter fra Firestore
  const fetchActivities = async () => {
    if (!auth.currentUser) {
      console.log("⚠️ Ingen bruker logget inn. Kan ikke hente data.");
      return;
    }

    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "activities"));
      const fetchActivities: Activity[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        location: doc.data()?.location || "Ukjent sted",
        organizer: doc.data()?.organizer || "Ukjent sted",
        date: doc.data()?.date || "Ukjent dato",
        participants: doc.data()?.maxParticipants || 0,
        details: doc.data()?.details || '',
      }));
      

      console.log("📥 Hentet aktiviteter:", fetchActivities);
      setActivities(fetchActivities);
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
    fetchActivities();
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
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Vibe</Text>
      {user ? (
        <FlatList
        data={activities}
          keyExtractor={(item) => item.id}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push(`/activity/${item.id}`)}>
              <View style={styles.card}>
                <Text style={[styles.activityType, styles.textWhite]}> {item.organizer}</Text>
                <Text style={styles.textWhite}>📍  {item.location}</Text>
                <Text style={styles.textWhite}>🗓️  {item.date}</Text>
                <Text style={styles.textWhite}>{item.details}</Text>
              </View>
            </Pressable>
          )}

        />
        
      ) : (
        <View>
          <Text>⚠️ Du må logge inn for å se aktiviteter.</Text>
          <Button title="🔑 Logg inn" onPress={() => router.replace("/login")} />
        </View>
      )}
      <FooterBar/>
    </SafeAreaView>
  );
}

// 🔹 Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#2c2c2e',
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 15,
    color: "#D4FF00",
  },
  card: {
    backgroundColor: '#4a4a4c',
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 0.2,
    shadowColor: '#000',
    shadowOpacity: 0.65,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 2,
    elevation: 3
  },
  activityType: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  textWhite: {
    color: '#ffffff'
  }
  
});
