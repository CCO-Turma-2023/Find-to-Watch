import { getSpecificCinema } from "@/services/scrap";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View, Image } from "react-native";
import { StatusBar } from "expo-status-bar";
import CalendarSlider from "@/components/Calendar";

export default function SpecificCinema() {
  const { id } = useLocalSearchParams();
  const [specificCinema, setSpecificCinema] = useState<SpecificCinema[]>();
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const fetchCinema = async () => {
      if (typeof id === "string") {
        const cinema = await getSpecificCinema(id, date);
        setSpecificCinema(cinema);
      }
    };

    fetchCinema();
  }, [id, date]);

  return (
    <View className="flex flex-1 flex-col bg-black p-5">
      <StatusBar style="light" backgroundColor="black" translucent={false} />
      <Pressable className=" rounded-full bg-gray-800 w-[50px] h-[50px] flex justify-center items-center" onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={30} color="#ffffff" />
      </Pressable>

      <View className="h-24 w-full">
        <CalendarSlider onDateChange={setDate} />
      </View>

      {specificCinema && specificCinema.length > 0 ? (
        <FlatList
          data={specificCinema}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="mt-5 flex items-center justify-center">
              <Image
                source={{ uri: item.poster_path }}
                className="h-60 w-44 rounded"
                resizeMode="cover"
              />

              <Text className="mb-2 text-2xl font-bold text-white pt-3">
                {item.title}
              </Text>

              <Text className="mb-3 text-base text-gray-300">{item.overview}</Text>

              {/* Horários Dublados */}

              {item.showtimesDubbed.length > 0 && (
                <View className="flex items-center justify-center">
                  <Text className="mb-1 font-semibold text-white">
                    Dublado:
                  </Text>
                  <View className="mb-5 flex-row flex-wrap">
                    {item.showtimesDubbed.map((sessao, index) => (
                      <Text
                        key={index}
                        className="mb-2 mr-2 rounded bg-white/20 px-2 py-1 text-white"
                      >
                        {new Date(sessao.startsAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    ))}
                  </View>
                </View>
              )}

              {/* Horários Legendados */}
              {item.showtimesOriginal.length > 0 && (
                <View>
                  <Text className="mb-1 font-semibold text-white">
                    Legendado:
                  </Text>
                  <View className="mb-4 flex-row flex-wrap">
                    {item.showtimesOriginal.map((sessao, index) => (
                      <Text
                        key={index}
                        className="mb-2 mr-2 rounded bg-white/20 px-2 py-1 text-white"
                      >
                        {new Date(sessao.startsAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Text>
                    ))}
                  </View>
                </View>
              )}
              <View className="h-1 w-full rounded-full bg-white"></View>
            </View>
          )}
        />
      ) : (
        <View className="h-full w-full items-center justify-center">
          <Text className="text-white">Não existe sessões para esse dia!</Text>
        </View>
      )}
    </View>
  );
}
