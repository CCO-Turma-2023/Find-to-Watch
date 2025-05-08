import { TextInput, View, Text } from "react-native";
import { router } from "expo-router";
import { requestContents } from "@/services/searchContent";
import ShowMedia from "@/components/AllShowMedia";
import { MovieSearchProps } from "@/interfaces/search-interface";
import { useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { StatusBar } from "expo-status-bar";
import { Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function Search() {
  const [media, setMedia] = useState<MovieSearchProps[]>([]);
  const [busca, setBusca] = useState("");
  const [selectFilter, setSelectFilter] = useState<number[]>([]);

  const changeTextInput = (text: string) => {
    requestContents(text, setMedia, selectFilter);
    setBusca(text);
  };

  const [filters, setFilters] = useState([
    {
      id: 1,
      name: "Filmes",
      icon: <MaterialCommunityIcons name="movie" size={20} color="white" />,
    },
    {
      id: 2,
      name: "Séries",
      icon: <Feather name="tv" size={20} color="white" />,
    },
    {
      id: 3,
      name: "Cinema",
      icon: <Feather name="film" size={20} color="white" />,
    },
  ]);

  return (
    <View className="flex flex-1 flex-col bg-black p-2">
      <StatusBar style="light" backgroundColor="black" translucent={false} />

      <Pressable className="mb-4" onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={30} color="#ffffff" />
      </Pressable>

      <View className="mb-4 flex flex-row items-center gap-1 rounded border border-gray-400 p-2">
        <AntDesign name="search1" color={"white"} size={20} />
        <TextInput
          className="ml-2 flex-1 text-white"
          placeholder="Busque algum conteúdo"
          onChangeText={changeTextInput}
          value={busca}
        />
      </View>

      <View className="flex flex-row gap-3">
        {filters.map((filter) => {
          const isSelected = selectFilter.includes(filter.id);

          return (
            <Pressable
              key={filter.id}
              className={`flex flex-row items-center gap-1 rounded-xl border p-2 ${
                isSelected ? "border-blue-500 bg-blue-700" : "border-gray-400"
              }`}
              onPress={() => {
                setSelectFilter(
                  (prev) =>
                    prev.includes(filter.id)
                      ? prev.filter((id) => id !== filter.id) // desmarca
                      : [...prev, filter.id], // marca
                );
              }}
            >
              {filter.icon}
              <Text className="text-white">{filter.name}</Text>
            </Pressable>
          );
        })}
      </View>

      {media && media.length > 0 ? (
        <View className="flex-1">
          <Text className="mb-2 text-base text-white">
            Resultados da busca por <Text className="font-bold">{busca}</Text>:
          </Text>
          <ShowMedia medias={media} horizontal={false} />
        </View>
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text className="text-white">Nenhum resultado ainda.</Text>
        </View>
      )}
    </View>
  );
}
