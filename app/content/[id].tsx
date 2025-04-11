import { View, Text, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import {getFilmId} from "@/services/scrap";
import { useContextHome } from "@/contexts/ContextHome";
import { RequestMediabyId } from "@/services/searchContent";
import { MovieSearchProps } from "@/interfaces/search-interface";
import { Link } from 'expo-router';

export default function Filmes() {
  const { id } = useLocalSearchParams();
  const [currentMovie, setCurrentMovie] = useState<MovieSearchProps | null>(null);
  const [nowPlaying, setNowPlaying] = useState(false);
  const { media } = useContextHome();
  const [code, setCode] = useState()

  const OnPress = async () => {
    const result = await getFilmId(currentMovie!.title);
    setCode(result); 
  };

  useEffect(() => {
    if (code) {
      router.push(`/content/sections/${code}`);
    }
  }, [code]);

  useEffect(() => {
    const findContent = async () => {
      let foundMovie = null;

      for (let i in media[0]) {
        if (id.slice(0, -1) == media[0][i].id) {
          foundMovie = media[0][i];
          setNowPlaying(true);
          break;
        }
      }

      if (!foundMovie) {
        foundMovie = await RequestMediabyId(id);
      }

      setCurrentMovie(foundMovie);
    };

    findContent();
  }, []);

  return (
    <View className='bg-black flex-1'>
      <Text className='text-white '>Informações de <Text className='font-bold'>{currentMovie?.title}</Text> aparecerão aqui</Text>
      {
      nowPlaying && 
      
        <Pressable onPress={OnPress}>
            <Text className="text-white">Ver Sessões</Text>
        </Pressable>
      }
    </View>
  );
}
