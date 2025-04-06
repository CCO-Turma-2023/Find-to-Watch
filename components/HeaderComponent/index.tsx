import { useContextHome } from "@/contexts/ContextHome";
import { requestContents } from "@/services/searchContent";
import { useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";

export default function Header() {
  const [movieSearch, setMovieSearch] = useState("");
  const { media, setMedia } = useContextHome();

  const changeTextInput = (text: string) => {
    setMovieSearch(text);
  };

  return (
    <View className="flex w-full items-center justify-center bg-blue-600 p-2">
      <View className="flex flex-row items-center justify-center">
        <View className="h-12 w-12 rounded-full bg-white"></View>
        <TextInput
          placeholder="Digite o nome do filme"
          onChangeText={changeTextInput}
          value={movieSearch}
          className="mx-4 max-h-fit max-w-fit rounded border border-gray-400 p-2"
        />
        <Pressable
          className="rounded bg-blue-600"
          onPress={() => requestContents(movieSearch, setMedia)}
        >
          <Text className="font-semibold text-white">Buscar Filme</Text>
        </Pressable>
      </View>
      <View className="w-full flex-row justify-between px-4 py-2">
        <Pressable>
          <Text className="text-base text-black">Home</Text>
        </Pressable>
        <Pressable>
          <Text className="text-base text-black">Filmes</Text>
        </Pressable>
        <Pressable>
          <Text className="text-base text-black">Séries</Text>
        </Pressable>
        <Pressable>
          <Text className="text-base text-black">Cinema</Text>
        </Pressable>
      </View>
    </View>
  );
}
