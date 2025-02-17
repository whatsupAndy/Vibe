import { Stack, useRouter } from "expo-router";
import { Button } from "react-native";

export default function ActivityLayout() {
  const router = useRouter();

  return (
    <Stack>
      <Stack.Screen 
        name="[id]" 
        options={{ 
          headerTitle: "Rediger Aktivitet", 
          headerLeft: () => (
            <Button title="⬅ Tilbake" onPress={() => router.push("/")} />
          )
        }} 
      />
    </Stack>
  );
}
