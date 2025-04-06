import ShowMedia from "@/components/HomeShowMedia";
import { useContextHome } from "@/contexts/ContextHome";
import { ScrollView } from "react-native";

export default function Home() {
    const {media, setMedia} = useContextHome()
    return ( 
        <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
                <ShowMedia medias={media}></ShowMedia>
        </ScrollView>
    )
}