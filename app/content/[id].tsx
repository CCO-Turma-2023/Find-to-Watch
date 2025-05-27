import { View, Text, Pressable, Image, ScrollView, TouchableOpacity, Linking } from "react-native";
import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { getFilmId } from "@/services/scrap";
import { RequestMediabyId, requestWatchProvides } from "@/services/searchContent";
import { MovieSearchProps, contentProvider, providerLink } from "@/interfaces/search-interface";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useContextCinema } from "@/contexts/ContextCinema";
import { getProviderLink } from "@/services/scrap"

export default function Filmes() {

  const { id } = useLocalSearchParams();
  const [currentMovie, setCurrentMovie] = useState<MovieSearchProps | null>(null);
  const [nowPlaying, setNowPlaying] = useState(false);
  const [watchProviders, setWatchProviders] = useState<contentProvider[] | undefined>(undefined);
  const [providerLinks, setproviderLinks] = useState<providerLink[] | undefined>(undefined);
  const { media } = useContextCinema();

  const OnPress = async () => {
    const result = await getFilmId(currentMovie!.title);
    router.push(`/content/sections/${result}`);
  };

  useEffect(() => {
    const findContent = async () => {
      let foundMovie = null;

      if (media && media[0]?.length > 0 && media[1]?.length > 0) {
        for (let i in media[0]) {
          if (id.slice(0, -1) == media[0][i].id) {
            foundMovie = media[0][i];
            setNowPlaying(true);
            break;
          }
        }
        for (let i in media[1]) {
          if (id.slice(0, -1) == media[1][i].id) {
            foundMovie = media[1][i];
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

      const contentProviders = await requestWatchProvides(id);

      if (!contentProviders) {
        return;
      }

      const uniqueContentProviders = Array.from(
        new Map<string, contentProvider>(contentProviders.map((p: contentProvider) => [p.provider_name, p])).values()
      );

      if (contentProviders) {
        setWatchProviders(uniqueContentProviders)

        const links = await getProviderLink(id)

        setproviderLinks(links)
      }

    };

    findContent();
  }, [media]);


  const matchLinktoProvider = (content: contentProvider) => {
    if (!providerLinks) {
      return;
    }

    let url;

    providerLinks.forEach(element => {
      if (element.title.includes(content.provider_name)) {
        url = element.link;
      }
    });

    if (!url) {
      return;
    }

    Linking.openURL(url)
  }

  const year = currentMovie?.release_date ? new Date(currentMovie.release_date).getFullYear() : undefined;

  return (
    <ScrollView className="flex-1 gap-3 bg-black p-2" showsVerticalScrollIndicator={false}>
      <View className="flex-1 gap-3 bg-black p-2">

        <StatusBar style="light" backgroundColor="black" translucent={false} />

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

            {year ?
              <Text className="text-zinc-300">
                {year}
              </Text> : null
            }

            <Text className="text-zinc-300">
              {currentMovie?.overview && currentMovie?.overview?.length > 0
                ? currentMovie.overview
                : "Sem sinopse"}
            </Text>

            {watchProviders && <View className="flex flex-row flex-wrap">
              {(
                <>
                  <Text className="text-white w-full mb-2">Stream</Text>
                  {watchProviders.map((content: contentProvider, index: number) => (
                    (
                      <View key={index} className="w-1/4 p-1">
                        <TouchableOpacity onPress={() => matchLinktoProvider(content)}>
                          <Image
                            source={{ uri: `https://image.tmdb.org/t/p/original${content.logo_path}` }}
                            style={{ width: '100%', height: 60, borderRadius: 8 }}
                            resizeMode="contain"
                          />
                        </TouchableOpacity>
                      </View>
                    )
                  ))}
                </>
              )}
            </View>}

            {nowPlaying && (
              <Pressable className="flex w-full items-center" onPress={OnPress}>
                <Ionicons name="film" size={30} color="#ffffff" />
                <Text className="text-white">Sessões Disponíveis</Text>
              </Pressable>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
