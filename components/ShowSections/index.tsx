import { MovieSearchProps } from "@/interfaces/search-interface";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { FlatList, View, Text, Pressable } from "react-native";
import ShowMedia from "../AllShowMedia";
import React, { useEffect, useState } from "react";
import {Filtro} from "@/interfaces/filters"


interface Props {
  sections: { titulo: string; index: number; icon?: any, id?: number, page?: number}[];
  media: {media: MovieSearchProps[][], hasSubSections: boolean, subSections?:any}[];
  Header?: React.JSX.Element;
  Trailers?: any;
  incPage?:boolean
  funcIncPage?: (index:number, type: "movie" | "tv") => void
  index1?:number
}


export default function ShowSections({sections, media, Header, incPage = false, funcIncPage, Trailers, index1 } : Props){
    
    return(
        <FlatList
        ListHeaderComponent={Header}
        data={sections}
        keyExtractor={(item) => item.index.toString()}
        contentContainerStyle={{ paddingBottom: 56 }}
        showsVerticalScrollIndicator={false}
        style={{ backgroundColor: '#1A1A1A', paddingVertical: 8 }}
        renderItem={({ item }) => {
          const currentMedia = media[item.index];
          if (!currentMedia) return null;

          let categoria: MovieSearchProps[] = [];
          let categorias: { media: MovieSearchProps[][]; hasSubSections: boolean; subSections?: any }[] = [];

          if (!currentMedia.hasSubSections) {
            categoria = currentMedia.media.flat();
          } else {
            categorias = currentMedia.media.map((m) => ({
              media: [m],
              hasSubSections: false,
            }));
          }

          return (
            <View style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', gap: 4, alignItems: 'center' }}>
                {item.icon && (
                  <MaterialIcons
                    name={item.icon}
                    size={25}
                    style={{ marginLeft: 8 }}
                    color="red"
                  />
                )}
                <Text style={{ paddingLeft: 8, fontSize: 18, fontWeight: '600', color: 'white' }}>
                  {item.titulo}
                </Text>
              </View>
              {!currentMedia.hasSubSections ? (
                item.titulo === 'Trailers' ? (
                  <ShowMedia medias={categoria} horizontal={true} Trailers={Trailers}  />
                ) : index1 ? (
                  <ShowMedia medias={categoria} horizontal={true} incPage={incPage} funcIncPage={funcIncPage} index1={index1} index2={item.index}/>
                ) : 
                <ShowMedia medias={categoria} horizontal={true}/>
              ) : (
                <ShowSections media={categorias} incPage={true} funcIncPage={funcIncPage} index1={item.index} sections={currentMedia.subSections} />
              )}
            </View>
          );
        }}
      />
    )
}
