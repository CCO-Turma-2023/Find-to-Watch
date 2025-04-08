import AntDesign from '@expo/vector-icons/AntDesign'
import { useState } from "react";
import { View, Text, Pressable, TextInput, Image } from "react-native";
import { Link } from "expo-router";

export default function Header() {
  const [movieSearch, setMovieSearch] = useState("");

  
  return (
    <View className="w-full bg-blue-600 ">
      <View className="flex-row items-center justify-between p-6">
        <Text className='font-bold text-white p-2'>Find to Watch</Text>
        <View className='flex flex-row p-2'>
          {/* Botão de busca */}
          <Link href="/search" className="p-2">
            <AntDesign name="search1" size={24} color="white" />
          </Link>

            {/* Avatar */}
          <View className="h-12 w-12 rounded-full bg-white overflow-hidden">
            <Image
              source={{
                uri: `https://cdn.discordapp.com/attachments/1220349851007455255/1310675460941676624/the-famous-wet-owl-also-known-as-lamont-appears-to-be-a-v0-0awtil7kynr81.jpg?ex=67f56ca5&is=67f41b25&hm=3cbb2900252068d5460798b47686bec264352674d10cbc6e131882a9659a1f9e&`,
              }}
              className="h-full w-full"
            />
          </View>
        </View>
      </View>
    </View>
  );
}
