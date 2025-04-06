import { Stack } from "expo-router";
import "../global.css"

export default function RootLayout() {
  return (
  <Stack>
    <Stack.Screen
        name="index"
        options={{
          headerShown: false, // Oculta o header inteiro
        }}
      />
  </Stack>
)
}
