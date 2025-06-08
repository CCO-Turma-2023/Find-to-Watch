import { View, Image, FlatList, Dimensions } from "react-native";
import { Link } from "expo-router";
import { MovieSearchProps } from "@/interfaces/search-interface";
import YoutubePlayer from "react-native-youtube-iframe";

interface ShowMediaProps {
  medias: MovieSearchProps[];
  horizontal?: boolean;
  Trailers?: any
}

const numColumns = 2;
const screenWidth = Dimensions.get("window").width;
const itemWidth = screenWidth / numColumns - 8; 

export default function ShowMedia({ medias, horizontal, Trailers }: ShowMediaProps) {
  return Trailers ? (
    <FlatList
      data={Trailers}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      numColumns={horizontal ? 1 : numColumns}
      horizontal={horizontal}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 8, paddingTop: 8 }}
      columnWrapperStyle={!horizontal ? { justifyContent: "space-between" } : undefined}
      renderItem={({ item }) => (
        <View style={{ width: horizontal ? undefined : itemWidth, padding: 4, marginBottom: 8 }}>
          <YoutubePlayer
            height={200}
            width={320}
            videoId={item.key}
            play={false}
          />
        </View>
      )}
    />
  ) : (
    <FlatList
      data={medias}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      numColumns={horizontal ? 1 : numColumns}
      horizontal={horizontal}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 8, paddingTop: 8 }}
      columnWrapperStyle={!horizontal ? { justifyContent: "space-between" } : undefined}
      renderItem={({ item }) => {
        return (
           <View style={{ width: horizontal ? undefined : itemWidth, padding: 4, marginBottom: 8 }}>
              {item && <Link
                href={{
                  pathname: "/content/[id]",
                  params: {
                    id: `${item.id}${item.hasOwnProperty("title") ? 1 : 0}`,
                  },
                }}
              >
                {item && item.poster_path && (
                  <Image
                    source={{
                      uri: `https://image.tmdb.org/t/p/original${item.poster_path}`,
                    }}
                    style={{
                      width: horizontal ? 176 : itemWidth,
                      height: 240,
                      borderRadius: 8,
                    }}
                  />
                )}
              </Link>}
        </View>
        )
      }}
    />
  );
}
