import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import { MovieSearchProps } from "@/interfaces/search-interface";

interface ShowMediaProps {
  medias: MovieSearchProps[];
}

export default function ShowMedia({ medias }: ShowMediaProps) {
  return (
    <ScrollView
      horizontal={true}
      className="flex w-full flex-row"
      showsHorizontalScrollIndicator={false}
    >
      {medias?.length > 0 &&
        medias.map((media, index) => (
          <View key={index} className="mb-4 flex p-1">
            {media.poster_path && (
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/original${media.poster_path}`,
                }}
                className="h-36 w-24"
              />
            )}
            {/* <Text className="text-center text-lg font-bold">{media.title}</Text>
            <Text className="text-center">{media.overview}</Text> */}
          </View>
        ))}
    </ScrollView>
  );
}
