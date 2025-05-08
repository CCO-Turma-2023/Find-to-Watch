import { View } from "react-native";
import TVShow from "../../components/TVShowMedia";
import Movie from "@/components/MovieMedia";

export default function Filmes() {
  return (
    <View className="flex-1 bg-black">
      <TVShow />
    </View>
  );
}
