import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="modal/editcategory"
        options={{
          presentation: "modal",
        }}
      />
    </Stack>
  );
}
