import { View, Text, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import handlePress from "@/services/scrap";
import { useContextHome } from "@/contexts/ContextHome";
import { RequestMediabyId } from "@/services/searchContent";
import { MovieSearchProps } from "@/interfaces/search-interface";

export default function Filmes() {
  const { id, movie } = useLocalSearchParams();
  let currentMovie: null | MovieSearchProps = null;
  const [nowPlaying, setNowPlaying] = useState(false);
  const { media } = useContextHome();

  console.log(movie)

  useEffect( () => {

    const findContent = async () => {
      
    for (let i in media[0])
    {
      if (id.slice(0, -1) == media[0][i].id)
      {
        currentMovie = media[0][i];
        setNowPlaying(true);
        break;
      }
    }
    
    if (currentMovie === null)
    {
      currentMovie = await RequestMediabyId(id);
    }

    console.log(currentMovie);
  }
  findContent();
},[]);

  return (
    <View className='bg-black flex-1'>
      <Text className='text-white '>Descrição de conteudo com id <Text className='font-bold'>{id}</Text> aparecerá aqui</Text>
      {
      nowPlaying && 
      <Pressable onPress={handlePress}>
        <Text className="text-white">Ver Sessões</Text>
      </Pressable>
      }
    </View>
  );
}
