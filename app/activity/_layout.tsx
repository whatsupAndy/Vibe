import { Stack } from "expo-router";

export default function ActivityLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // 👈 skjuler toppen
        contentStyle: {
          backgroundColor: "#2c2c2e", // 👈 mørk bakgrunn også bak tastelinje etc.
        },
      }}
    />
  );
}
