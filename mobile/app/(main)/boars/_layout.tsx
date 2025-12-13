import { Stack } from "expo-router";

export default function BoarsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Boars" }} />
      <Stack.Screen name="[id]" options={{ title: "Boar Details" }} />
    </Stack>
  );
}
