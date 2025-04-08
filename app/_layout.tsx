import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="(tabs)"></Stack.Screen>
        <Stack.Screen name="content"></Stack.Screen>
        <Stack.Screen name="search"></Stack.Screen>
      </Stack>
  );
}
