import { Stack } from "expo-router";
import "../global.css";
import { ProviderHome } from "@/contexts/ContextHome";

export default function RootLayout() {
  return (
      <ProviderHome>
        <Stack screenOptions={{headerShown: false}}>
          <Stack.Screen name="(tabs)"></Stack.Screen>
          <Stack.Screen name="content"></Stack.Screen>
          <Stack.Screen name="search"></Stack.Screen>
        </Stack>
      </ProviderHome>
  );
}
