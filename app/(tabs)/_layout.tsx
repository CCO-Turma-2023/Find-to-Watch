import { Tabs } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ProviderHome } from "@/contexts/ContextHome";
import { ProviderMovie } from "@/contexts/ContextMovie";
import { ProviderTVShow } from "@/contexts/ContextTVShow";
import Header from "@/components/HeaderComponent";
import {
  SafeAreaView,
  Platform,
  StatusBar as RNStatusBar,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProviderCinema } from "@/contexts/ContextCinema";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const statusBarHeight =
    Platform.OS === "android" ? RNStatusBar.currentHeight || 0 : insets.top;

  return (
    <ProviderHome>
      <ProviderMovie>
        <ProviderTVShow>
          <ProviderCinema>
            <SafeAreaView className="flex-1 bg-blue-600">
              <View
                style={{ height: statusBarHeight }}
                className="absolute left-0 right-0 top-0 z-10"
              >
                <LinearGradient
                  colors={["rgba(2, 77, 191, 1)", "rgba(1, 36, 89, 1)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  className="h-full w-full"
                />
              </View>

              <StatusBar
                style="light"
                translucent
                backgroundColor="transparent"
              />

              <View
                className="flex-1"
                style={{
                  paddingTop: statusBarHeight,
                  paddingBottom: insets.bottom,
                }}
              >
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
                      bottom: insets.bottom,
                      left: 0,
                      right: 0,
                      height: 60,
                      borderTopWidth: 0,
                      overflow: "hidden",
                    },
                    tabBarItemStyle: {
                      borderRightWidth: route.name !== "cinema" ? 1 : 0,
                      borderRightColor: "rgba(255, 255, 255, 0.3)",
                      marginVertical: 12,
                    },
                  })}
                >
                  <Tabs.Screen
                    name="index"
                    options={{
                      title: "Home",
                      tabBarIcon: () => (
                        <Feather name="home" size={20} color="white" />
                      ),
                    }}
                  />
                  <Tabs.Screen
                    name="movies"
                    options={{
                      title: "Filmes",
                      tabBarIcon: () => (
                        <MaterialCommunityIcons
                          name="movie"
                          size={20}
                          color="white"
                        />
                      ),
                    }}
                  />
                  <Tabs.Screen
                    name="tvshow"
                    options={{
                      title: "Séries",
                      tabBarIcon: () => (
                        <Feather name="tv" size={20} color="white" />
                      ),
                    }}
                  />
                  <Tabs.Screen
                    name="cinema"
                    options={{
                      title: "Cinema",
                      tabBarIcon: () => (
                        <Feather name="film" size={20} color="white" />
                      ),
                    }}
                  />
                </Tabs>
              </View>
            </SafeAreaView>
          </ProviderCinema>
        </ProviderTVShow>
      </ProviderMovie>
    </ProviderHome>
  );
}
