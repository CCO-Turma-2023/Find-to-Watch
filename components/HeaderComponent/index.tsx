import { View, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function Header() {
  return (
    <View className="flex-row bg-[#1A1A1A] items-center justify-between p-2 pb-3 px-4 border border-b-white">
      <View style={{ width: 40 }} />

      
      <View className="flex-1 items-center">
        <Text className="text-white font-bold text-xl">FIND TO WATCH</Text>
      </View>

      
      <View className="rounded-full bg-[#262626] border border-[rgba(255,255,255,0.8)] mr-2">
          <Ionicons className="p-2" name="notifications" size={24} color="white" />
      </View>
    </View>
  );
}
