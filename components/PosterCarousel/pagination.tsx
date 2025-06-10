import { View} from "react-native";
import Animated,{SharedValue } from "react-native-reanimated"

interface Props{
    items:{ image: string, id:string, title?: string, name?: string }[],
    paginationIndex: number,
    scrollX: SharedValue<number>
}

export default function Pagination({items, paginationIndex, scrollX} : Props){
    return(
        <View className="flex flex-row justify-center items-center">
           {items.map((_,index) => {
            return (
                <Animated.View 
                key={index} 
                className={`${paginationIndex === index ? `bg-[#fff]` : `bg-[#aaa]`} h-2 w-2 m-2 rounded-full`} 
                />
            )
           })}
        </View>
    )
}