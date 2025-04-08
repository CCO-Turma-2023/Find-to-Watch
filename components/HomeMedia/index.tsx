import ShowMedia from "@/components/HomeShowMedia";
import { useContextHome } from "@/contexts/ContextHome";
import { ScrollView, Text, View } from "react-native";

export default function Home() {
  const { media } = useContextHome();
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 32 }} className="bg-black">
      {/* Seção: Em Cartaz */}
      <View className="mb-4">
        <Text className="pl-2 text-lg font-semibold text-white">Em Cartaz</Text>
        <ShowMedia medias={media} horizontal={true} />
      </View>

      {/* Seção: Drama */}
      <View>
        <Text className="pl-2 text-lg font-semibold text-white">Drama</Text>
          <ShowMedia medias={media} horizontal={true} />
      </View>
    </ScrollView>
  );
}
