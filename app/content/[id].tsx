import { View, Text, Pressable, Image } from "react-native";
import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { getFilmId } from "@/services/scrap";
import { useContextHome } from "@/contexts/ContextHome";
import { RequestMediabyId } from "@/services/searchContent";
import { MovieSearchProps } from "@/interfaces/search-interface";
import { Ionicons } from "@expo/vector-icons";

export default function Filmes() {
  const { id } = useLocalSearchParams();
  const [currentMovie, setCurrentMovie] = useState<MovieSearchProps | null>(
    null,
  );
  const [nowPlaying, setNowPlaying] = useState(false);
  const { media } = useContextHome();

  const OnPress = async () => {
    const result = await getFilmId(currentMovie!.title);
    router.push(`/content/sections/${result}`);
  };

  useEffect(() => {
    const findContent = async () => {
      let foundMovie = null;

      if (media && media[0]?.length > 0) {
        for (let i in media[0]) {
          if (id.slice(0, -1) == media[0][i].id) {
            foundMovie = media[0][i];
            setNowPlaying(true);
            break;
          }
        }
      }

      if (!foundMovie) {
        foundMovie = await RequestMediabyId(id);
      }

      if (id[id.length - 1] === "1") {
        foundMovie["movie"] = true;
      } else {
        foundMovie["title"] = foundMovie["name"];
        delete foundMovie["name"];
        foundMovie["movie"] = false;
      }

      setCurrentMovie(foundMovie);
    };

    findContent();
  }, [media]);

  return (
    <View className="flex flex-1 gap-3 bg-black p-2">
      <Pressable onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={30} color="#ffffff" />
      </Pressable>

      <Image
      source={{
        uri: `https://image.tmdb.org/t/p/original${currentMovie?.poster_path}`,
      }}
      style={{
        width: "100%",
        height: 300,
      }}
      resizeMode="contain"
      />

      {media && media.length > 0 && (
        <View className="flex flex-col gap-4">
          <Text className="text-white">
            <Text className="font-bold">{currentMovie?.title}</Text>
          </Text>

          <Text className="text-zinc-300">
            {currentMovie?.overview && currentMovie?.overview?.length > 0
              ? currentMovie.overview
              : "Sem sinopse"}
          </Text>
          {nowPlaying && (
            <Pressable className="flex w-full items-center" onPress={OnPress}>
              <Ionicons name="film" size={30} color="#ffffff" />

              <Text className="text-white">Sessões Disponíveis</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}
