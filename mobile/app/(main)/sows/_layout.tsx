import { Stack } from "expo-router";

export default function SowsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Sows" }} />
      <Stack.Screen name="[id]" options={{ title: "Sow Details" }} />
    </Stack>
  );
}
