import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function Filmes() {
  const { id } = useLocalSearchParams();

  return (
    <View className='bg-black flex-1'>
      <Text className='text-white '>Descrição de conteudo com id <Text className='font-bold'>{id}</Text> aparecerá aqui</Text>
    </View>
  );
}
