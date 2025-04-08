import ShowMedia from "@/components/HomeShowMedia";
import { useContextHome } from "@/contexts/ContextHome";
import { ScrollView, Text } from "react-native";

export default function Home() {
  const { media } = useContextHome();
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
      <Text className="pl-2 text-lg font-semibold text-white">Lançamentos</Text>
      <ShowMedia medias={media}></ShowMedia>
      <Text className="pl-2 text-lg font-semibold text-white">Drama</Text>
      <ShowMedia medias={media}></ShowMedia>
    </ScrollView>
  );
}
