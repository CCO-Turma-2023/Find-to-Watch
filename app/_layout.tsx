import { Stack } from "expo-router";
import "../global.css";
import { ProviderHome } from "@/contexts/ContextHome";
import { ProviderCinema } from "@/contexts/ContextCinema";

import { LocationProvider } from "@/contexts/ContextLocation";

export default function RootLayout() {
  return (
    <ProviderHome>
          <ProviderCinema>
            <LocationProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)"></Stack.Screen>
                <Stack.Screen
                  name="theater"
                  options={{ presentation: "modal" }}
                ></Stack.Screen>
              </Stack>
            </LocationProvider>
          </ProviderCinema>
    </ProviderHome>
  );
}
