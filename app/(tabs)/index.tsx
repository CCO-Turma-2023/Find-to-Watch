import { useContextHome } from "@/contexts/ContextHome";
import { FlatList, ScrollView, View } from "react-native";
import Loading from "@/components/loading"
import PosterCarousel from "@/components/PosterCarousel"
import ShowSections from "@/components/ShowSections";
import Header from "@/components/HeaderComponent";
import { MovieSearchProps } from "@/interfaces/search-interface";

const categorias1 = [
  { titulo: "Em Cartaz nos Cinemas", index: 0, icon: "theaters" },
  { titulo: "Em Alta", index: 1, icon: "local-fire-department" },
];

const categorias2 = [
  { titulo: "Filmes", index: 0, icon: "movie" },
  { titulo: "Séries", index: 1, icon: "tv" },
];

export default function Index() {
  const {fixedMedia, dynamicMedia, loading, filtrar } = useContextHome();

  let posters:{image: string, id:string, title?: string, name?: string }[] = []

  if(!loading && fixedMedia){
     posters = [
      { image: `https://image.tmdb.org/t/p/original${fixedMedia[1][0].poster_path}`, id: fixedMedia[1][0].id, title: fixedMedia[1][0].title },
      { image: `https://image.tmdb.org/t/p/original${fixedMedia[1][1].poster_path}`, id: fixedMedia[1][1].id, name: fixedMedia[1][1].name },
      { image: `https://image.tmdb.org/t/p/original${fixedMedia[0][0].poster_path}`, id: fixedMedia[0][0].id, title: fixedMedia[0][0].title },
    ];
  }

  const sections = [
    {
      key: 'fixed',
      component: (
        <ShowSections
          sections={categorias1}
          media={fixedMedia}
          hasFilters={false}
        />
      ),
    },
    {
      key: 'dynamic',
      component: (
        <ShowSections
          sections={categorias2}
          media={dynamicMedia}
          hasFilters={true}
          func={filtrar}
        />
      ),
    },
  ];

  return (
  <>
    <Header />
    <View className="flex-1 bg-[#1A1A1A] py-14">
      {loading ? (
        <Loading />
      ) : fixedMedia && dynamicMedia ? (
        <FlatList
          className="bg-[#1A1A1A] px-2"
          data={sections}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => item.component}
          ListHeaderComponent={<PosterCarousel posters={posters} />}
          showsVerticalScrollIndicator={false}
        />
      ) : null}
    </View>
  </>
);

}
