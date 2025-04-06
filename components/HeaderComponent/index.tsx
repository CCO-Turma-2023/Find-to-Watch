import { useContextHome } from '@/contexts/ContextHome';
import { requestContents } from '@/services/searchContent';
import { useState } from 'react';
import { View, Text, Pressable, TextInput } from 'react-native';

export default function Header() {
    const [movieSearch, setMovieSearch] = useState("");
    const {media, setMedia} = useContextHome()

    const changeTextInput = (text: string) => {
        setMovieSearch(text);
      };

  return ( 
    <View className='w-full bg-blue-600 flex justify-center p-2 items-center'>
        <View className="flex flex-row justify-center items-center">
            <View className="bg-white rounded-full h-12 w-12"></View>
            <TextInput
                placeholder="Digite o nome do filme"
                onChangeText={changeTextInput}
                value={movieSearch}
                className="border border-gray-400 rounded p-2  mx-4 max-w-fit max-h-fit"
            />
            <Pressable
                className="bg-blue-600 rounded"
                onPress={() => requestContents(movieSearch, setMedia)}
                >
                <Text className="text-white font-semibold">Buscar Filme</Text>
            </Pressable>

        </View>
        <View className="flex-row justify-between w-full px-4 py-2 ">
            <Pressable>
                <Text className="text-black text-base">Home</Text>
            </Pressable>
            <Pressable>
                <Text className="text-black text-base">Filmes</Text>
            </Pressable>
            <Pressable>
                <Text className="text-black text-base">Séries</Text>
            </Pressable>
            <Pressable>
                <Text className="text-black text-base">Cinema</Text>
            </Pressable>
        </View>
    </View>
   
  );
}
