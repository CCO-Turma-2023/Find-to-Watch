import { useContextHome } from "@/contexts/ContextHome";
import { requestContents } from "@/services/searchContent";
import { useState } from "react";
import { View, Text, Pressable, TextInput, Image } from "react-native";

export default function Header() {
  const [movieSearch, setMovieSearch] = useState("");
  const { media, setMedia } = useContextHome();

  const changeTextInput = (text: string) => {
    setMovieSearch(text);
  };

  return (
    <View className="flex w-full items-center justify-center bg-blue-600 p-2">
      <View className="flex flex-row items-center justify-center">
        <View className="flex h-12 w-12 items-center rounded-full bg-white">
          <Image
            source={{
              uri: `https://cdn.discordapp.com/attachments/1220349851007455255/1310675460941676624/the-famous-wet-owl-also-known-as-lamont-appears-to-be-a-v0-0awtil7kynr81.jpg?ex=67f56ca5&is=67f41b25&hm=3cbb2900252068d5460798b47686bec264352674d10cbc6e131882a9659a1f9e&`,
            }}
            className="h-full w-full rounded-full"
          />
        </View>
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
      <View className="w-full flex-row items-center justify-between px-4 py-2">
        <Pressable>
          <Text className="text-base text-black">Home</Text>
        </Pressable>
        <View className="h-4 w-px bg-black opacity-30" />
        <Pressable>
          <Text className="text-base text-black">Filmes</Text>
        </Pressable>
        <View className="h-4 w-px bg-black opacity-30" />
        <Pressable>
          <Text className="text-base text-black">Séries</Text>
        </Pressable>
        <View className="h-4 w-px bg-black opacity-30" />
        <Pressable>
          <Text className="text-base text-black">Cinema</Text>
        </Pressable>
      </View>
    </View>
  );
}
