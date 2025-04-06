import { useState } from "react";
import { View, Text, Pressable, TextInput, Image } from "react-native";
import { MovieSearchProps } from "@/interfaces/search-interface";

interface ShowMediaProps {
  medias: MovieSearchProps[];
}

export default function ShowMedia({ medias }: ShowMediaProps) {
  return (
    <View>
      {medias?.length > 0 &&
        medias.map((media, index) => (
          <View key={index} className="mb-4 flex items-center p-4">
            {media.poster_path && (
              <Image
                source={{
                  uri: `https://image.tmdb.org/t/p/original${media.poster_path}`,
                }}
                style={{ width: 200, height: 300 }}
              />
            )}
            <Text className="text-center text-lg font-bold">{media.title}</Text>
            <Text className="text-center">{media.overview}</Text>
          </View>
        ))}
    </View>
  );
}
