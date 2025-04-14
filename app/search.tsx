import {TextInput, View, Text} from 'react-native'
import { router } from 'expo-router';
import { requestContents } from "@/services/searchContent";
import ShowMedia from "@/components/AllShowMedia";
import { MovieSearchProps } from '@/interfaces/search-interface';
import { useState } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign'
import { StatusBar } from 'expo-status-bar';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Search(){
    const [media, setMedia] = useState<MovieSearchProps[]>([]);
    const [busca, setBusca] = useState("")

    const changeTextInput = (text: string) => {
        requestContents(text, setMedia)
        setBusca(text)
      };
    
    return(
        <View className="flex flex-col flex-1 p-2 bg-black">
            <StatusBar style="light" backgroundColor="black" translucent={false} />

            <Pressable className='mb-4' onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={30} color="#ffffff" />
            </Pressable>

            <View className="flex flex-row gap-1 items-center rounded border border-gray-400 p-2 mb-4">
                <AntDesign name="search1" color={'white'} size={20} />
                <TextInput
                className="ml-2 flex-1 text-white"
                placeholder="Busque algum conteúdo"
                onChangeText={changeTextInput}
                value={busca}
                />
            </View>

            {media && media.length > 0 ? (
                <View className="flex-1">
                    <Text className="text-base text-white mb-2">Resultados da busca por <Text className="font-bold">{busca}</Text>:</Text>
                    <ShowMedia medias={media} horizontal={false} />
                </View>
            ) : (
                <View className="flex-1 items-center justify-center">
                    <Text className="text-white">Nenhum resultado ainda.</Text>
                </View>
            )}
        </View>
    )
}
