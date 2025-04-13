import { View } from "react-native";
import { useEffect } from "react";
import Movie from "../../components/MovieMedia";

export default function Movies() {

  return (
    <View className="bg-black flex-1">
      <Movie />
    </View>
  );
}
