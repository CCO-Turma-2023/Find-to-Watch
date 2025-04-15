import { View, Image, ScrollView } from "react-native";

import { Link } from "expo-router";
import { MovieSearchProps } from "@/interfaces/search-interface";

interface ShowMediaProps {
  medias: MovieSearchProps[];
  horizontal?: boolean;
}

export default function ShowMedia({ medias, horizontal }: ShowMediaProps) {
  return (
    <ScrollView showsVerticalScrollIndicator={false} className="flex px-2 pt-2">
      <View className="flex-row flex-wrap justify-between">
        {medias?.length > 0 &&
          medias.map((media, index) => (
            <View key={index} className="gap mb-2 flex w-[50%] p-1">
              <Link
                href={{
                  pathname: "/content/[id]",
                  params: {
                    id: `${media.id}${media.hasOwnProperty("title") ? 1 : 0}`,
                  },
                }}
              >
                {media.poster_path && (
                  <Image
                    source={{
                      uri: `https://image.tmdb.org/t/p/original${media.poster_path}`,
                    }}
                    className="h-60 w-44 rounded"
                  />
                )}
              </Link>
            </View>
          ))}
      </View>
    </ScrollView>
  );
}
