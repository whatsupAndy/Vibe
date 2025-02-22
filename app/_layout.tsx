import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Stack, useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig";

export default function RootLayout() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("🔍 Brukerstatus oppdatert:", currentUser ? currentUser.email : "Ingen bruker logget inn");
      setUser(currentUser);
      setLoading(false);

      if (!currentUser) {
        console.log("📌 Ingen bruker funnet, sender til login...");
        router.replace("/login"); // Bruker replace for å unngå tilbake-knapp til feil skjerm
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      {user ? (
        <>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen 
            name="new-activity" 
            options={{ 
              headerTitle: "Ny Ryddeaksjon", 
              headerBackVisible: true // 🔹 Skjuler tilbakeknappen på "Ny aksjon"
            }} 
          />
          <Stack.Screen 
            name="activity/[id]" 
            options={{ 
              headerTitle: "Ryddeaksjon", 
              headerBackVisible: true // 🔹 Viser tilbakeknapp på detaljerte sider
            }} 
          />
        </>
      ) : (
        <>
          <Stack.Screen name="login" options={{ headerTitle: "Logg Inn", headerBackVisible: false }} />
          <Stack.Screen name="register" options={{ headerTitle: "Registrer", headerBackVisible: true }} />
        </>
      )}
    </Stack>
  );
}
