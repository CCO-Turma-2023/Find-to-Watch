import ShowMedia from "@/components/HomeShowMedia";
import { useContextHome } from "@/contexts/ContextHome";
import { ScrollView, Text, View } from "react-native";

export default function Home() {
  const { media } = useContextHome();
  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
      className="bg-black"
    >
      {/* Seção: Em Cartaz */}
      <View className="mb-4">
        <Text className="pl-2 text-lg font-semibold text-white">Em Cartaz</Text>
        <ShowMedia medias={media[0]} horizontal={true} />
      </View>

      {/* Seção: Ação */}
      <View>
        <Text className="pl-2 text-lg font-semibold text-white">Ação</Text>
        <ShowMedia medias={media[1]} horizontal={true} />
      </View>

      {/* Seção: Drama */}
      <View>
        <Text className="pl-2 text-lg font-semibold text-white">Drama</Text>
        <ShowMedia medias={media[2]} horizontal={true} />
      </View>

      {/* Seção: Comédia */}
      <View>
        <Text className="pl-2 text-lg font-semibold text-white">Comédia</Text>
        <ShowMedia medias={media[3]} horizontal={true} />
      </View>

      {/* Seção: Animation */}
      <View>
        <Text className="pl-2 text-lg font-semibold text-white">Animação</Text>
        <ShowMedia medias={media[4]} horizontal={true} />
      </View>
    </ScrollView>
  );
}
