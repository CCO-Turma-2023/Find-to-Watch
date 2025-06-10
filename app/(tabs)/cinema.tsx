import { Text, View, FlatList, Image, ScrollView } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Link } from "expo-router";
import { useContextCinema } from "@/contexts/ContextCinema";
import { useEffect } from "react";
import { TheaterInterface } from "@/interfaces/theater-interface";
import { TouchableOpacity } from "react-native";
import Loading from "@/components/loading"
import Header from "@/components/HeaderComponent";
import ShowSections from "@/components/ShowSections";
import AddCinema from "@/components/AddCinema";

const categorias = [
  { titulo: "Estreias da Semana", index: 0 },
  { titulo: "Também em Cartaz", index: 1 },
  { titulo: "Em Breve", index: 2 },
  { titulo: "Trailers", index: 3 },
];

export default function Filmes() {
  const { media, loading } = useContextCinema();
  const { cinemas, getAllDataFromAsyncStorage, setCinemas, removeCine } =
    useContextCinema();
  let Trailers: any

  useEffect(() => {
    const getAll = async () => {
      const c = await getAllDataFromAsyncStorage();
      setCinemas(c);
    };

    getAll();
  }, []);

  if(!loading){ 
    Trailers = [...media[0].media.flat(), ...media[1].media.flat(), ...media[2].media.flat()]
  }

  return (
    <>
      <Header />
      <View className="flex-1 bg-[#1A1A1A] p-2" >
        {loading ? <Loading /> : 
          <ShowSections sections={categorias} media={media.flat()} Header={<AddCinema cinemas={cinemas} removeCine={removeCine} />} Trailers={Trailers}/>
        }
      </View>
    </>
  )
}