import { Text, View, FlatList, Image } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import {Link, } from "expo-router"
import { useContextCinema } from "@/contexts/ContextCinema";
import { MovieSearchProps } from "@/interfaces/search-interface";
import YoutubePlayer from "react-native-youtube-iframe";


const categorias = [
  { titulo: "Em Cartaz", index: 0 },
  { titulo: "Em Breve", index: 1 },
  { titulo: "Trailers", index: 2 },
];


export default function Filmes(){
    const { media } = useContextCinema();

    const Trailers = [...media[0], ...media[1]];

    return(
        <View className="bg-black flex-1">
            <View className="m-2 flex flex-col gap-2 ">
                <Text className="text-white">Cinemas</Text>
                <View className="flex flex-row">
                    <Link href={"/theater"} className={`p-2 flex flex-row border border-white rounded-xl`}>
                        <AntDesign name="plus" color="white" size={20}></AntDesign>
                    </Link>
                </View>
            </View>
            <FlatList
                  data={categorias}
                  keyExtractor={(item) => item.titulo}
                  contentContainerStyle={{ paddingBottom: 32 }}
                  showsVerticalScrollIndicator={false}
                  className="bg-black py-2"
                  renderItem={({ item }) => {
                    const categoriaFilmes: MovieSearchProps[] = item.titulo === "Trailers" ? Trailers : media[item.index] || [];
            
                    return (
                      <View className="mb-8">
                        <Text className="pl-2 text-lg font-semibold text-white">
                          {item.titulo}
                        </Text>
            
                        <FlatList
                        data={categoriaFilmes}
                        keyExtractor={(mediaItem, index) => `${mediaItem.id}${index}`}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 8, paddingTop: 8 }}
                        renderItem={({ item: mediaItem }) => {
                            return (
                            <View className="mr-2">
                                {item.titulo === "Trailers" && mediaItem.key ? (
                                <YoutubePlayer
                                height={200}
                                width={320}
                                videoId={mediaItem.key}
                                play={false}
                                />
                                ) : item.titulo !== "Trailers" ? (
                                <Link
                                    href={{
                                    pathname: "/content/[id]",
                                    params: {
                                        id: `${mediaItem.id}${mediaItem.hasOwnProperty("title") ? 1 : 0}`,
                                    },
                                    }}
                                >
                                    {mediaItem.poster_path && (
                                    <Image
                                        source={{
                                        uri: `https://image.tmdb.org/t/p/original${mediaItem.poster_path}`,
                                        }}
                                        className="h-60 w-44 rounded"
                                    />
                                    )}
                                </Link>
                                ) : null}
                            </View>
                            );
                        }}
                        />

                      </View>
                    );
                  }}
                />
        </View>    
        )
}

