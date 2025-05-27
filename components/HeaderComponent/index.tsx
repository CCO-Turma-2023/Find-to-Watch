import { View, Image } from "react-native";
import { Link } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { LinearGradient } from "expo-linear-gradient";
import logo from "@/assets/images/logo.png";

export default function Header() {
  return (
    <LinearGradient
      colors={["rgba(2, 77, 191, 1)", "rgba(1, 36, 89, 1)"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      className="w-full"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex items-center justify-center">
          <Image
            source={logo}
            style={{
              width: 82,  
              height: 82,  
            }}
            resizeMode="contain"
          />
        </View>

        <View className="flex flex-row gap-3 p-2">
          {/* Botão de busca */}
          <Link href="/search" className="p-2">
            <AntDesign name="search1" size={24} color="white" />
          </Link>

          {/* Avatar */}
          <View className="h-12 w-12 overflow-hidden rounded-full bg-white items-center justify-center">
            <Image
              source={{uri: "https://i.redd.it/the-famous-wet-owl-also-known-as-lamont-appears-to-be-a-v0-0awtil7kynr81.jpg?width=750&format=pjpg&auto=webp&s=293b8103fdffd57e5ffa13c5a6f02795347061a8"}}
              style={{
                width: 50, 
                height: 50,
              }}
            />
        </View>
        </View>
      </View>
    </LinearGradient>
  );
}
