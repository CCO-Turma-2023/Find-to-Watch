import { View } from "react-native"
import { ActivityIndicator, MD2Colors } from 'react-native-paper';

export default function Loading() {

    return(
        <View className="h-full w-full flex justify-center items-center bg-[#1A1A1A] ">
            <ActivityIndicator animating={true} size="large" color={MD2Colors.blue800} />
        </View>
    )
}