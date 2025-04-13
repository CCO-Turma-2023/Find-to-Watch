import { Tabs } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ProviderHome } from "@/contexts/ContextHome";
import { ProviderMovie } from "@/contexts/ContextMovie";
import { ProviderTVShow } from "@/contexts/ContextTVShow";
import Header from "@/components/HeaderComponent";

export default function TabLayout() {
  return (
    <ProviderHome>
      <ProviderMovie>
        <ProviderTVShow>
      <Header />
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "black",
          tabBarStyle: {
            backgroundColor: "rgb(37, 99, 235)",
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 50,
            borderTopWidth: 0,
            overflow: "hidden",
          },
          tabBarItemStyle: {
            borderRightWidth: route.name !== "cinema" ? 1 : 0, // traço até a penúltima opção da barra de tabs
            borderRightColor: "rgba(255, 255, 255, 0.3)",
            marginVertical: 12,
          },
        })}
        >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: () => <Feather name="home" size={20} color="white" />,
          }}
          />
        <Tabs.Screen
          name="movies"
          options={{
            title: "Filmes",
            tabBarIcon: () => (
              <MaterialCommunityIcons name="movie" size={20} color="white" />
            ),
          }}
          />
        <Tabs.Screen
          name="tvshow"
          options={{
            title: "Séries",
            tabBarIcon: () => <Feather name="tv" size={20} color="white" />,
          }}
          />
        <Tabs.Screen
          name="cinema"
          options={{
            title: "Cinema",
            tabBarIcon: () => <Feather name="film" size={20} color="white" />,
          }}
          />
      </Tabs>
          </ProviderTVShow>
      </ProviderMovie>
    </ProviderHome>
  );
}
