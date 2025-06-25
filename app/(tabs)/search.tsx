import { TextInput, View, Text } from "react-native";
import { requestContents } from "@/services/searchContent";
import ShowMedia from "@/components/AllShowMedia";
import { MovieSearchProps } from "@/interfaces/search-interface";
import { useEffect, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Pressable } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

export default function Search() {
  const [media, setMedia] = useState<MovieSearchProps[]>([]);
  const [busca, setBusca] = useState("");
  const [selectFilter, setSelectFilter] = useState<number[]>([]);
  const tabBarHeight = useBottomTabBarHeight();

  const changeTextInput = (text: string) => {
    requestContents(text, setMedia, selectFilter);
    setBusca(text);
  };

  // UseEffect para realizar a busca novamente se o usuário já tiver escrito algo antes de marcar ou desmarcar um filtro
  useEffect(() => {
    if (busca.trim() !== "") {
      requestContents(busca, setMedia, selectFilter);
    }
  }, [selectFilter]);

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
    <View style={{paddingBottom:tabBarHeight}} className="flex flex-1 flex-col bg-[#1A1A1A] p-4">
      <View className="mb-4 flex flex-row items-center gap-1 rounded-3xl border border-gray-400" style={{padding:10}}>
        <AntDesign name="search1" color={"white"} size={20} />
        <TextInput
          className="ml-2 flex-1 text-white"
          placeholder="Digite um filme ou uma série"
          placeholderTextColor="gray"
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
