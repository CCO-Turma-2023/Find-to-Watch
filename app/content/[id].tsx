import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Dimensions,
} from "react-native";
import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { getFilmId } from "@/services/scrap";
import {
  RequestMediabyId,
  requestWatchProvides,
} from "@/services/searchContent";
import {
  MovieSearchProps,
  contentProvider,
  providerLink,
} from "@/interfaces/search-interface";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useContextCinema } from "@/contexts/ContextCinema";
import { getProviderLink } from "@/services/scrap";
import Loading from "@/components/loading";

export default function Filmes() {
  const { id } = useLocalSearchParams();
  const [currentMovie, setCurrentMovie] = useState<MovieSearchProps | null>(
    null,
  );
  const [nowPlaying, setNowPlaying] = useState(false);
  const [watchProviders, setWatchProviders] = useState<
    contentProvider[] | undefined
  >(undefined);
  const [providerLinks, setproviderLinks] = useState<
    providerLink[] | undefined
  >(undefined);
  const { media } = useContextCinema();
  const [loading, setLoading] = useState(true);

  const OnPress = async () => {
    const result = await getFilmId(currentMovie!.title);
    router.push(`/content/sections/${result}`);
  };

  useEffect(() => {
    const findContent = async () => {
      let foundMovie = null;

      if (
        media &&
        media[0].media[0]?.length > 0 &&
        media[1].media[0]?.length > 0
      ) {
        // Verifica no media[0]
        for (let item of media[0].media[0]) {
          if (String(item.id) === id.slice(0, -1)) {
            foundMovie = item;
            setNowPlaying(true);
            break;
          }
        }

        // Verifica no media[1]
        for (let item of media[1].media[0]) {
          if (String(item.id) === id.slice(0, -1)) {
            foundMovie = item;
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

      let contentProviders: contentProvider[] | undefined;

      try {
        contentProviders = await requestWatchProvides(id);
      } catch (err) {
        contentProviders = undefined;
      }

      if (!contentProviders) {
        setLoading(false);
        return;
      }

      const uniqueContentProviders = Array.from(
        new Map<string, contentProvider>(
          contentProviders.map((p: contentProvider) => [p.provider_name, p]),
        ).values(),
      );

      setWatchProviders(uniqueContentProviders);

      const links = await getProviderLink(id);

      setproviderLinks(links);

      setLoading(false);
    };

    findContent();
  }, [media]);

  const matchLinktoProvider = (content: contentProvider) => {
    if (!providerLinks) {
      return;
    }

    let url;

    providerLinks.forEach((element) => {
      if (element.title.includes(content.provider_name)) {
        url = element.link;
      }
    });

    if (!url) {
      return;
    }

    Linking.openURL(url);
  };

  const { width: windowWidth } = Dimensions.get("window");

  const year = currentMovie?.release_date
    ? new Date(currentMovie.release_date).getFullYear()
    : undefined;

  return loading || !currentMovie ? (
    <Loading />
  ) : (
    <ScrollView
      className="flex-1 gap-3 bg-black p-2"
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 gap-3 bg-black">
        <StatusBar style="light" backgroundColor="black" translucent={false} />

        <Pressable className="absolute z-50" onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={30} color="#ffffff" />
        </Pressable>
        <View className="w-full">
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/original${currentMovie?.poster_path}`,
            }}
            style={{
              width: windowWidth,
              height: 600, // ou 400, ajuste conforme seu layout
            }}
            resizeMode="cover"
          />

          {media && media.length > 0 && (
            <View className="flex h-full flex-col gap-3 p-2">
              <View className="flex w-full flex-col gap-2">
                <View className="absolute -top-12 w-full items-center">
                  <View className="rounded-full bg-zinc-500/50 px-2 py-1">
                    {year ? (
                      <Text className="font-bold text-white/80">{year}</Text>
                    ) : null}
                  </View>
                </View>

                <Text className="text-2xl font-bold text-white">
                  {currentMovie?.title}
                </Text>

                <Text className="text-white">
                  {currentMovie?.overview && currentMovie?.overview?.length > 0
                    ? currentMovie.overview
                    : "Sem sinopse"}
                </Text>
              </View>

              {watchProviders && (
                <View className="flex flex-row flex-wrap">
                  {
                    <>
                      <Text className="mb-2 w-full text-white">Stream</Text>
                      {watchProviders.map(
                        (content: contentProvider, index: number) => (
                          <View key={index} className="w-1/4 p-1">
                            <TouchableOpacity
                              onPress={() => matchLinktoProvider(content)}
                            >
                              <Image
                                source={{
                                  uri: `https://image.tmdb.org/t/p/original${content.logo_path}`,
                                }}
                                style={{
                                  width: "100%",
                                  height: 60,
                                  borderRadius: 8,
                                }}
                                resizeMode="contain"
                              />
                            </TouchableOpacity>
                          </View>
                        ),
                      )}
                    </>
                  }
                </View>
              )}

              {nowPlaying && (
                <Pressable
                  className="bg- bg- flex w-full items-center"
                  onPress={OnPress}
                >
                  <Ionicons name="film" size={30} color="#ffffff" />
                  <Text className="text-white">Sessões Disponíveis</Text>
                </Pressable>
              )}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
