import ShowMedia from "@/components/HomeShowMedia";
import { useContextMovie } from "@/contexts/ContextMovie";
import { ScrollView, Text, View } from "react-native";

export default function Movie() {
  const { media } = useContextMovie();
  return (
    <ScrollView
      contentContainerStyle={{ paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
      className="bg-black py-2"
    >
      {/* Seção: Tendências */}
      <View className="mb-4">
        <Text className="pl-2 text-lg font-semibold text-white">Tendências</Text>
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

      {/* Seção: Animação */}
      <View>
        <Text className="pl-2 text-lg font-semibold text-white">Animação</Text>
        <ShowMedia medias={media[4]} horizontal={true} />
      </View>

      {/* Seção: Documentário */}
      <View>
        <Text className="pl-2 text-lg font-semibold text-white">Documentário</Text>
        <ShowMedia medias={media[5]} horizontal={true} />
      </View>

      {/* Seção: Terror */}
      <View>
        <Text className="pl-2 text-lg font-semibold text-white">Terror</Text>
        <ShowMedia medias={media[6]} horizontal={true} />
      </View>

      {/* Seção: Romance */}
      <View>
        <Text className="pl-2 text-lg font-semibold text-white">Romance</Text>
        <ShowMedia medias={media[7]} horizontal={true} />
      </View>

      {/* Seção: Ficção Científica */}
      <View>
        <Text className="pl-2 text-lg font-semibold text-white">Ficção Científica</Text>
        <ShowMedia medias={media[8]} horizontal={true} />
      </View>

      {/* Seção: Musical */}
      <View>
        <Text className="pl-2 text-lg font-semibold text-white">Musical</Text>
        <ShowMedia medias={media[9]} horizontal={true} />
      </View>

      {/* Seção: História */}
      <View>
        <Text className="pl-2 text-lg font-semibold text-white">História</Text>
        <ShowMedia medias={media[10]} horizontal={true} />
      </View>
    </ScrollView>
  );
}
