import { Text, View, Pressable } from "react-native";
import axios from "axios";
import { useEffect, useState } from "react";


export default function Filmes() {
  const [html, setHtml] = useState("");

  return (
    <View className="flex-1 bg-black">
      <View>
        <Text className="text-white">Filmes aparecerão aqui</Text>
      </View>
    </View>
  );
}
