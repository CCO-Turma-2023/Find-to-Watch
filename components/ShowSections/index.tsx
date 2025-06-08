import { MovieSearchProps } from "@/interfaces/search-interface";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { FlatList, View, Text, Pressable } from "react-native";
import ShowMedia from "../AllShowMedia";
import React, { useEffect, useState } from "react";
import {filters} from "@/interfaces/filters"

interface Props{
    sections: {titulo: string, index: number, icon?:any}[],
    media: MovieSearchProps[][],
    hasFilters:boolean
    func?: (filtros: filters) => void
    Header?: React.JSX.Element
    Trailers?: any
}

const movies = [
    {filter: "Ação", id: 28},
    {filter: "Drama", id: 18},
    {filter: "Comédia", id: 35},
    {filter: "Animação", id: 16},
    {filter: "Documentário", id: 99},
    {filter: "Terror", id: 27},
    {filter: "Romance", id: 10749},
    {filter: "Sci-Fi", id: 878},
    {filter: "Musical", id: 10402},
    {filter: "História", id: 36},
    {filter: "Suspense", id: 53},
]

const series = [
    {filter: "Ação e Aventura", id: 10759},
    {filter: "Drama", id: 18},
    {filter: "Comédia", id: 35},
    {filter: "Animação", id: 16},
    {filter: "Documentário", id: 99},
    {filter: "Infantil", id: 10762},
    {filter: "Romance", id: 10749},
    {filter: "Fantasia", id: 10765},
    {filter: "Reality Show", id: 10764},
    {filter: "História", id: 36},
    {filter: "Mistério", id: 9648},
]


export default function ShowSections({sections, media, Header, func, hasFilters, Trailers } : Props){
    
    const [selectFilterMovie, setSelectFilterMovie] = useState<number[]>([28]);
    const [selectFilterTv, setSelectFilterTv] = useState<number[]>([10759]);

    useEffect(() => {
        if (hasFilters && func) {
            const filters = { movie: selectFilterMovie, tv: selectFilterTv };
            func(filters);
        }
    }, [selectFilterMovie, selectFilterTv, hasFilters, func]);

    return(
        <FlatList
            ListHeaderComponent={Header}
            data={sections}
            keyExtractor={(item) => item.titulo}
            contentContainerStyle={{ paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
            className="bg-[#1A1A1A] py-2"
            renderItem={({ item }) => {
              const categoriaFilmes: MovieSearchProps[] = media[item.index] || [];
      
              return (
                <View className="mb-8">
                  <View className="flex flex-row gap-1">
                    {item.icon && <MaterialIcons
                          name={item.icon}
                          size={25}
                          style={{marginLeft:8}}
                          color="red"
                        />}
                    <Text className="pl-2 text-lg font-semibold text-white">
                      {item.titulo}
                    </Text>
                  </View>
                  { hasFilters && (
                    <View className="flex flex-row gap-3 flex-wrap px-4 py-2">
                      {item.titulo === "Filmes" ? 
                          movies.map((filtro) => {
                              const isSelected = selectFilterMovie.includes(filtro.id);
                              return(
                                  <Pressable
                                      key={filtro.id}
                                      className={`border ${isSelected ? "border-red-500" : "border-white"} rounded-3xl px-4 py-2 bg-[#2B2B2B]`}
                                      onPress={() => setSelectFilterMovie(
                                          (prev) =>
                                          prev.includes(filtro.id)
                                              ? prev.filter((id) => id !== filtro.id)
                                              : [...prev, filtro.id],
                                      )}
                                  >
                                      <Text className="text-white">{filtro.filter}</Text>
                                  </Pressable>
                              )
                          })
                          : item.titulo === "Séries" ?
                              series.map((filtro) => {
                                  const isSelected = selectFilterTv.includes(filtro.id);
                                  return(
                                      <Pressable
                                          key={filtro.id}
                                          className={`border ${isSelected ? "border-red-500" : "border-white"} rounded-3xl px-4 py-2 bg-[#2B2B2B]`}
                                          onPress={() => setSelectFilterTv(
                                              (prev) =>
                                              prev.includes(filtro.id)
                                                  ? prev.filter((id) => id !== filtro.id)
                                                  : [...prev, filtro.id],
                                          )}
                                      >
                                          <Text className="text-white">{filtro.filter}</Text>
                                      </Pressable>
                                  )
                              }) : 
                          null
                       }
                    </View>
                  )}
                  {item.titulo === "Trailers" ? <ShowMedia medias={categoriaFilmes} horizontal={true} Trailers={Trailers}/> : (item.titulo === "Filmes" && selectFilterMovie.length !== 0) || (item.titulo === "Séries" && selectFilterTv.length !== 0) || categoriaFilmes.length !== 0 ? <ShowMedia medias={categoriaFilmes} horizontal={true}/> : <Text className="text-white text-xl w-full text-center p-4">Sem filtros selecionados</Text> }
                </View>
              );
            }}
        />
    )
}
