import { View, Text, Pressable, Modal } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";


export default function Header() {
  const [showTab, setShowTab] = useState(false);

  return (
    <View className="flex-row bg-[#1A1A1A] items-center justify-between p-2 pb-3 px-4 border border-b-white">
      <View style={{ width: 40 }} />

      {showTab && <Modal
        transparent
        animationType="slide"
        visible={showTab}
        onRequestClose={() => setShowTab(false)}
      >
        <View className="w-full h-full flex flex-row">
          <View className="h-full w-1/2"/>
          <View className="h-full w-1/2 bg-[#1A1A1A]">
            <Pressable className="p-2" onPress={() => setShowTab(false)}> 
              <Ionicons name="close" color={'white'} size={25}></Ionicons>
            </Pressable>
          </View>

        </View>
      </Modal>
      }

      <View className="flex-1 items-center">
        <Text className="text-white font-bold text-xl">FIND TO WATCH</Text>
      </View>

      <Pressable className="rounded-full bg-[#262626] border border-[rgba(255,255,255,0.8)] mr-2" onPress={() => setShowTab((prev) => !prev)}>
          <Ionicons className="p-2" name="notifications" size={24} color="white" />
      </Pressable>
    </View>
  );
}
