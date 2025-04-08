import { Tabs} from "expo-router"
import { View } from "react-native";
import Feather from '@expo/vector-icons/Feather'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { ProviderHome } from "@/contexts/ContextHome";
import Header from "@/components/HeaderComponent";

export default function TabLayout(){
    return (
        <ProviderHome>
            <Header />
            <Tabs screenOptions={
                {
                    headerShown: false, 
                    tabBarActiveTintColor: 'white', 
                    tabBarStyle: {
                        backgroundColor: 'rgb(37, 99, 235)',  // ou bg-blue-600
                        borderTopLeftRadius: '1rem',
                        borderTopRightRadius: '1rem',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 50,
                        borderTopWidth: 0,
                        overflow: 'hidden'
                      },
                      tabBarBackground: () => (
                        <View style={{ flex: 1, backgroundColor: 'rgb(37, 99, 235)' }} />
                      ),
                }
            }>
                <Tabs.Screen name="index"  options={{title: 'Home', tabBarIcon: () => (<Feather name="home" size={20}/>)}}></Tabs.Screen>
                <Tabs.Screen name="filmes" options={{title: 'Filmes', tabBarIcon: () => (<MaterialCommunityIcons name="movie" size={20} />)}}></Tabs.Screen>
                <Tabs.Screen name="series" options={{title: 'Séries', tabBarIcon: () => (<Feather name="tv" size={20} />)}}></Tabs.Screen>
                <Tabs.Screen name="cinema" options={{title: 'Cinema', tabBarIcon: () => (<Feather name="film" size={20} />)}}></Tabs.Screen>
            </Tabs>
        </ProviderHome>
    )
}