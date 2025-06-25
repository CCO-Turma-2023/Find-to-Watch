import { router, Stack } from "expo-router";
import "../global.css";
import { ProviderHome } from "@/contexts/ContextHome";
import { ProviderCinema } from "@/contexts/ContextCinema";
import "react-native-reanimated";
import { LocationProvider } from "@/contexts/ContextLocation";
import * as Notifications from "expo-notifications";
import { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import * as Device from "expo-device";
import { saveToken } from "@/services/saveToken"

// Configuração global do handler de notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // Mostra alerta mesmo com app aberto
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();

  const registerForPushNotificationsAsync = async () => {
      if (Device.isDevice) {
        const { status: existingStatus } =
          await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        
        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        
        if (finalStatus !== "granted") {
          Alert.alert(
            "Permissão negada",
            "Não foi possível obter permissões para notificações.",
          );
          return;
        }
        const token = (await Notifications.getExpoPushTokenAsync()).data;
        setExpoPushToken(token);

        saveToken(token);
        
      } else {
        Alert.alert(
          "Erro",
          "As notificações só funcionam em dispositivos físicos.",
        );
      }

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
    };

  useEffect(() => {
    registerForPushNotificationsAsync();

    // Listener de quando a notificação chega
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        const { title, body } = notification.request.content;
        Alert.alert(title || "Notificação", body || "");
      },
    );

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    // Quando o usuário clica na notificação (background OU app fechado)
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const screen = response.notification.request.content.data.screen;

        console.log(
          "Usuário clicou na notificação com o app fechado ou em background",
        );
        console.log("Dados recebidos:", screen);

        router.push("/");
      });

    return () => {
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return (
    <ProviderHome>
      <ProviderCinema>
        <LocationProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="theater" options={{ presentation: "modal" }} />
          </Stack>
        </LocationProvider>
      </ProviderCinema>
    </ProviderHome>
  );
}