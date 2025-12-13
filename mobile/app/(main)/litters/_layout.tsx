import { Stack } from "expo-router";

export default function LittersLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Litters" }} />
    </Stack>
  );
}
