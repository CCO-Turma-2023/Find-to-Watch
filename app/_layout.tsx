import { router, Stack } from "expo-router";
import "../global.css";
import { ProviderHome, useContextHome } from "@/contexts/ContextHome";
import { ProviderCinema } from "@/contexts/ContextCinema";
import { LocationProvider } from "@/contexts/ContextLocation";
import "react-native-reanimated";

import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { saveToken } from "@/services/saveToken";

import { useEffect, useState } from "react";
import { Alert, Platform } from "react-native";
import dayjs from "dayjs"; // ➕ adicionado para comparar datas

// Configuração global do handler de notificações
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: false,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function NotificationHandler() {
  const { setShowTab, setNotifications } = useContextHome();
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();

  // 1. Solicita permissão e registra o token
  useEffect(() => {
    const register = async () => {
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;

        if (existingStatus !== "granted") {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }

        if (finalStatus !== "granted") {
          Alert.alert("Permissão negada", "Não foi possível obter permissões para notificações.");
          return;
        }

        const token = (await Notifications.getExpoPushTokenAsync()).data;
        setExpoPushToken(token);
        saveToken(token);
      } else {
        Alert.alert("Erro", "As notificações só funcionam em dispositivos físicos.");
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

    register();
  }, []);

  // 2. Limpa notificações se for um novo dia
  useEffect(() => {
    const clearOldNotifications = () => {
      setNotifications((prev) => {
        if (prev.length === 0) return prev;

        const today = dayjs().format("YYYY-MM-DD");
        const firstDate = dayjs(prev[0].date).format("YYYY-MM-DD");

        if (firstDate !== today) {
          return [];
        }

        return prev;
      });
    };

    clearOldNotifications();
  }, []);

  // 3. Ao iniciar, verifica se o app foi aberto por uma notificação
  useEffect(() => {
    const checkInitialNotification = async () => {
      const response = await Notifications.getLastNotificationResponseAsync();

      if (response) {
        const { title, body } = response.notification.request.content;
        const receivedAt = new Date(response.notification.date).toISOString();

        const payload = {
          title: title ?? "",
          message: body ?? "",
          date: receivedAt,
        };

        setNotifications((prev) => [...prev, payload]);
        setShowTab(true);
        router.push("/");
      }
    };

    checkInitialNotification();
  }, []);

  // 4. Se o app estiver em background e o usuário tocar na notificação
  useEffect(() => {
    const responseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const { title, body } = response.notification.request.content;
        const receivedAt = new Date(response.notification.date).toISOString();

        const payload = {
          title: title ?? "",
          message: body ?? "",
          date: receivedAt,
        };

        setNotifications((prev) => [...prev, payload]);
        setShowTab(true);
        router.push("/");
      }
    );

    return () => {
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);

  return null;
}

export default function RootLayout() {
  return (
    <ProviderHome>
      <ProviderCinema>
        <LocationProvider>
          <NotificationHandler />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="theater" options={{ presentation: "modal" }} />
          </Stack>
        </LocationProvider>
      </ProviderCinema>
    </ProviderHome>
  );
}
