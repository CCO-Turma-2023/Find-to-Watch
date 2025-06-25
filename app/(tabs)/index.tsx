import { useContextHome } from "@/contexts/ContextHome";
import { View, Text, Modal, Pressable } from "react-native";
import Loading from "@/components/loading"
import PosterCarousel from "@/components/PosterCarousel"
import ShowSections from "@/components/ShowSections";
import Header from "@/components/HeaderComponent";

const categorias = [
  { titulo: "Em Cartaz nos Cinemas", index: 0, icon: "theaters" },
  { titulo: "Em Alta", index: 1, icon: "local-fire-department" },
  { titulo: "Filmes", index: 2, icon: "movie" },
  { titulo: "Séries", index: 3, icon: "tv" }
];

export default function Index() {
  const {Media, loading, incPage } = useContextHome();

  let posters:{image: string, id:string, title?: string, name?: string }[] = []

  if(!loading && Media){
     posters = [
      { image: `https://image.tmdb.org/t/p/original${Media[1].media[0][0].poster_path}`, id: Media[1].media[0][0].id, title: Media[1].media[0][0].title },
      { image: `https://image.tmdb.org/t/p/original${Media[1].media[0][1].poster_path}`, id: Media[1].media[0][1].id, name: Media[1].media[0][1].name },
      { image: `https://image.tmdb.org/t/p/original${Media[0].media[0][0].poster_path}`, id: Media[0].media[0][0].id, title: Media[0].media[0][0].title },
    ];
  }

  return (
    <>
      <Header />
      <View className="flex-1 bg-[#1A1A1A] p-2">
        {loading ? (
          <Loading />
        ) : Media && <ShowSections media={Media.flat()} sections={categorias} funcIncPage={incPage} Header={<PosterCarousel posters = {posters}/>}/>} 
      </View>
    </>
  );
}
