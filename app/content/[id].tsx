import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Dimensions,
  FlatList,
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


      if (!foundMovie) {
        foundMovie = await RequestMediabyId(id);
      }

      if (
        media &&
        media[0].media[0]?.length > 0 &&
        media[1].media[0]?.length > 0
      ) {
        // Verifica no media[0]
        for (let item of media[0].media[0]) {
          if (String(item.id) === id.slice(0, -1)) {
            if(!foundMovie.overview){
              foundMovie.overview = item.overview
            }
            setNowPlaying(true);
            break;
          }
        }

        // Verifica no media[1]
        for (let item of media[1].media[0]) {
          if (String(item.id) === id.slice(0, -1)) {
            if(!foundMovie.overview){
              foundMovie.overview = item.overview
            }
            setNowPlaying(true);
            break;
          }
        }
      }

      if (id[id.length - 1] === "1") {
        foundMovie["movie"] = true;
      } else {
        foundMovie["title"] = foundMovie["name"];
        delete foundMovie["name"];
        foundMovie["release_date"] = foundMovie["first_air_date"]
        delete foundMovie["first_air_date"];
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

  const cast = currentMovie?.cast.filter((c: any) => c.profile_path) ?? []

  return loading || !currentMovie ? (
    <Loading />
  ) : (
    <>
      <Pressable className="absolute mt-10 ml-5 p-3 bg-[rgba(31,45,55,0.5)] rounded-full z-50" onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={30} color="#ffffff" />
      </Pressable>
      <ScrollView
        className="flex-1 gap-3 bg-black p-2"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 gap-3 bg-black">
          <StatusBar translucent backgroundColor="transparent" />
          
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

              <View className="flex h-full flex-col gap-3 p-2">
                <View className="flex w-full flex-col gap-2">

                  <Text className="text-2xl font-bold text-white pt-2 uppercase">
                    {currentMovie?.title}
                  </Text>

                  <View className="flex flex-row gap-2 items-center flex-wrap">

                    <View className="flex flex-row gap-2">
                    {currentMovie.genres?.map((g: any, index) => (
                      <View key={index} className="flex flex-row gap-2 justify-center items-center">
                        <Text className="text-gray-300">{g.name}</Text>
                        <View className="w-1 h-1 bg-gray-300 rounded-full" />
                      </View>
                    ))}
                  </View>

                    {currentMovie.runtime ? 
                    <>
                    <Text className="text-gray-300">{Math.floor(currentMovie.runtime / 60) + 'h' + currentMovie.runtime % 60 + 'm'}</Text>
                    <View className="w-1 h-1 bg-gray-300 rounded-full" />
                    </>
                    : null}
                    {year ? (
                        <Text className="text-gray-300">{year}</Text>
                      ) : null}
                  </View>

                  <ScrollView horizontal>
                    {currentMovie.ratings?.map((r: any, index) => 
                      r.Source === "Internet Movie Database" ? (
                        <View key={index} className="flex mx-1 flex-row items-center gap-2 w-[150px] h-[70px] rounded-3xl justify-center bg-gray-800">
                          <Image 
                            source={require('@/assets/images/imdb.png')}
                            className="w-[80px] h-[80px]"
                          />
                          <Text className="text-gray-300">{r.Value}</Text>
                        </View>
                      ) : r.Source === "Rotten Tomatoes" ? (
                        <View key={index} className="flex mx-1 flex-row items-center gap-2 w-[150px] h-[70px] rounded-3xl justify-center bg-gray-800">
                          <Image 
                            source={require('@/assets/images/rt.png')}
                            className="w-[80px] h-[80px]"
                          />
                          <Text className="text-gray-300">{r.Value}</Text>
                        </View>
                      ) : r.Source === "Metacritic" ? (
                        <View key={index} className="flex mx-1 flex-row items-center gap-2 w-[150px] h-[70px] rounded-3xl justify-center bg-gray-800">
                          <Image 
                            source={require('@/assets/images/mt.png')}
                            className="w-[80px] h-[80px]"
                          />
                          <Text className="text-gray-300">{r.Value}</Text>
                        </View>
                      ) : null
                  )}
                  </ScrollView>

                  
                  {watchProviders && (
                  <View className="flex flex-row flex-wrap justify-center items-center">
                    {
                      <>
                        <Text className="mb-2 w-full text-white text-xl font-bold">Streamings</Text>
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
                                      height: 60,
                                      aspectRatio: 1,
                                      borderRadius: 8
                                    }}
                                    resizeMode="cover"
                                  />
                                </TouchableOpacity>
                              </View>
                            ),
                          )}
                        </>
                      }
                    </View>
                  )}

                  <View>
                    <Text className="text-white text-xl font-bold">Sinopse</Text>
                    <Text className="text-gray-300">
                      {currentMovie?.overview && currentMovie?.overview?.length > 0
                        ? currentMovie.overview
                        : "Sem sinopse"}
                    </Text>
                  </View>

                  {cast.length > 0 && <View>
                    
                    <Text className="text-white text-xl font-bold">Elenco</Text>

                    <FlatList
                    data={currentMovie.cast.filter((c: any) => c.profile_path) ?? []}
                    keyExtractor={(item: any, index) => item.id?.toString() ?? index.toString()}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 10, marginTop: 8 }}
                    renderItem={({ item }) => (
                      <View className="mx-1">
                        <Image
                          source={{ uri: `https://image.tmdb.org/t/p/w185${item.profile_path}` }}
                          className="w-[90px] h-[90px] rounded-full"
                          resizeMode="cover"
                        />
                        <Text className="text-white text-xs text-center mt-1 w-[90px]">
                          {item.name}
                        </Text>
                      </View>
                    )}
                  />
                  </View>}
                </View>

                {nowPlaying && (
                  <View>
                    <Text className="text-white text-xl font-bold">Cinema</Text>
                    <View className="flex items-center">
                      <Pressable
                        className="bg-gray-800 flex justify-center items-center rounded-3xl p-2 w-[100px] h-[80px] "
                        onPress={OnPress}
                      >
                        <Ionicons name="film" size={30} color="#ffffff" />
                        <Text className="text-white">Ver Sessões</Text>
                      </Pressable>
                    </View>
                  </View>
                )}
              </View>
          </View>
        </View>
      </ScrollView>
      </>
  );
}
