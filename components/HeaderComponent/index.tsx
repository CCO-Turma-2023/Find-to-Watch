import AntDesign from "@expo/vector-icons/AntDesign";
import { View,  Image } from "react-native";
import { Link } from "expo-router";
import "./header.css";
import logo from "@/assets/images/logo.png"

export default function Header() {

  return (
    <View className="backgroundHeader w-full">
      <View className="flex-row items-center justify-between p-1">
        <View className="flex h-20 w-20 items-center justify-center">
          <Image
            source={logo}
            className="h-full max-h-full w-full max-w-full"
          ></Image>
        </View>

        <View className="flex flex-row gap-3 p-2">
          {/* Botão de busca */}
          <Link href="/search" className="p-2">
            <AntDesign name="search1" size={24} color="white" />
          </Link>

          {/* Avatar */}
          <View className="h-12 w-12 overflow-hidden rounded-full bg-white">
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
