import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  TextInput,
  Image,
  ScrollView,
} from "react-native";

import { Link } from "expo-router";
import { MovieSearchProps } from "@/interfaces/search-interface";

interface ShowMediaProps {
  medias: MovieSearchProps[];
  horizontal?: false | true;
}

export default function ShowMedia({ medias, horizontal }: ShowMediaProps) {
  return (
    <ScrollView
          horizontal={horizontal}
          showsHorizontalScrollIndicator={!horizontal}
          className="px-2 pt-2"
        >
      {medias?.length > 0 &&
        medias.map((media, index) => (
          <View key={index} className="mb-2 flex p-1">
              <Link href={{ pathname: "/content/[id]", params: { id: media.id} }}>
              {media.poster_path && (
                <Image
                  source={{
                    uri: `https://image.tmdb.org/t/p/original${media.poster_path}`,
                  }}
                  className="h-36 w-24"
                />
              )}
              </Link>
          </View>
        ))}
    </ScrollView>
  );
}
