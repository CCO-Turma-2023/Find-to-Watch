import { FlatList, Text, View, Image } from "react-native";
import { Link } from "expo-router";
import { MovieSearchProps } from "@/interfaces/search-interface";
import { useContextTVShow } from "@/contexts/ContextTVShow";

const categorias = [
  { titulo: "Tendências", index: 0 },
  { titulo: "Ação e Aventura", index: 1 },
  { titulo: "Drama", index: 2 },
  { titulo: "Comédia", index: 3 },
  { titulo: "Animação", index: 4 },
  { titulo: "Documentário", index: 5 },
  { titulo: "Infantil", index: 6 },
  { titulo: "Romance", index: 7 },
  { titulo: "Fantasia", index: 8 },
  { titulo: "Reality Show", index: 9 },
  { titulo: "História", index: 10 },
  { titulo: "Mistério", index: 11 },
];

export default function TVShow() {
  const { media } = useContextTVShow();

  return (
    <FlatList
      data={categorias}
      keyExtractor={(item) => item.titulo}
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
      className="bg-black py-2"
      renderItem={({ item }) => {
        const categoriaFilmes: MovieSearchProps[] = media[item.index]?.slice(0, 20) || []; // Limita a 20 itens

        return (
          <View className="mb-8">
            <Text className="pl-2 text-lg font-semibold text-white">
              {item.titulo}
            </Text>

            <FlatList
              data={categoriaFilmes}
              keyExtractor={(mediaItem) => mediaItem.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 8, paddingTop: 8 }}
              renderItem={({ item: mediaItem }) => (
                <View className="mr-2">
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
                </View>
              )}
            />
          </View>
        );
      }}
    />
  );
}
