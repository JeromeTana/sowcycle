import { Stack } from "expo-router";

export default function BreedingLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Breeding Records" }} />
    </Stack>
  );
}
