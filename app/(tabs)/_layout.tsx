import { Tabs } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  SafeAreaView,
  Platform,
  StatusBar as RNStatusBar,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import CustomTabBarButton from "@/components/CustomButton"

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const statusBarHeight =
    Platform.OS === "android" ? RNStatusBar.currentHeight || 0 : insets.top;

  return (
            <SafeAreaView className="flex-1 bg-blue-600">
              <View
                style={{ height: statusBarHeight, backgroundColor: "#1A1A1A" }}
                className="absolute left-0 right-0 top-0 z-10"
              />

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
                <Tabs
                screenOptions={() => ({
                  headerShown: false,
                  tabBarInactiveTintColor: "white",
                  tabBarStyle: {
                    position: "absolute",
                    bottom: insets.bottom,
                    left: 0,
                    right: 0,
                    height: 60,
                    backgroundColor: "rgb(0, 0, 0)",
                    borderTopWidth:0,
                    elevation: 0,
                    borderTopLeftRadius:20,
                    borderTopRightRadius: 20, 
                  },
                  tabBarItemStyle: {
                    marginVertical: 12,
                  },
                })}
                >
                  <Tabs.Screen
                    name="index"
                    options={{
                      tabBarShowLabel:false,
                      tabBarIcon: () => (
                        <Feather name="home" size={25} color="white" />
                      ),
                      tabBarButton: (props) => <CustomTabBarButton {...props} />,
                    }}
                  />
                  <Tabs.Screen
                    name="search"
                    options={{
                      tabBarShowLabel:false,
                      tabBarIcon: () => (
                        <Ionicons
                          name="search"
                          size={25}
                          color="white"
                        />
                      ),
                      tabBarButton: (props) => <CustomTabBarButton {...props} />,
                    }}
                  />
                  <Tabs.Screen
                    name="cinema"
                    options={{
                      tabBarShowLabel:false,
                      tabBarIcon: () => (
                        <Feather name="film" size={25} color="white" />
                      ),
                      tabBarButton: (props) => <CustomTabBarButton {...props} />,
                    }}
                  />
                </Tabs>
              </View>
            </SafeAreaView>
  );
}
