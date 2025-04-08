import { Text, View, Pressable } from "react-native";
import axios from "axios";
import { useEffect, useState } from "react";
import handlePress from "@/services/scrap";

export default function Filmes() {
  const [html, setHtml] = useState("");

  return (
    <View className="flex-1 bg-black">
      <View>
        <Text className="text-white">Filmes aparecerão aqui</Text>
      </View>
      <Pressable onPress={handlePress}>
        <Text className="text-white">Press</Text>
      </Pressable>
    </View>
  );
}
