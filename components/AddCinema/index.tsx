import { TheaterInterface } from "@/interfaces/theater-interface";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Link } from "expo-router";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";

interface Props{
    cinemas: TheaterInterface[],
    removeCine: (codigo:string) => void
}

export default function AddCinema({cinemas, removeCine} : Props){
    return (
        <View className="m-2 flex flex-col gap-2">
          <Text className="text-white text-lg font-bold">Cinemas</Text>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            className="flex flex-row p-2"
            contentContainerStyle={{ gap: 8 }}
          >
            <Link
              href={"/theater"}
              className={`flex flex-row rounded-xl border border-white p-3`}
            >
              <AntDesign name="plus" color="white" size={20}></AntDesign>
            </Link>
            {cinemas &&
              cinemas.map((cinema: TheaterInterface) => (
                <View
                  key={cinema.codigo}
                  className="flex-row items-center rounded-xl border border-white px-2 py-1"
                >
                  <Link
                    href={{
                      pathname: "/cinema/[id]",
                      params: { id: cinema.codigo },
                    }}
                    className="mr-2"
                  >
                    <Text className="text-white">{cinema.cinema}</Text>
                  </Link>
                  <TouchableOpacity
                    className="flex-1 rounded-full bg-red-500 p-2"
                    onPress={() => removeCine(cinema.codigo)}
                  >
                    <AntDesign name="close" size={16} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
          </ScrollView>
        </View>
    )
}