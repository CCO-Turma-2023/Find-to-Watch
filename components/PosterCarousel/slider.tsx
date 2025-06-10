import { Link } from "expo-router"
import { Image} from "react-native"
import Animated,{Extrapolation, interpolate, SharedValue, useAnimatedStyle, } from "react-native-reanimated"

interface Props{
    item: { image: string, id:string, title?: string, name?: string },
    index: number
    scrollX: SharedValue<number>
}

const width = 250

export default function SliderItem({item, index, scrollX}: Props){

    const rnAnimatedStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX:interpolate(
                        scrollX.value,
                        [(index-1) * width, index *width, (index+1) * width], 
                        [-width * 0.6, 0, width * 0.6], Extrapolation.CLAMP
                    ),
                },
                {
                    scale: interpolate (
                        scrollX.value,
                        [(index-1) * width, index *width, (index+1) * width], 
                        [0.9,1,0.9],
                        Extrapolation.CLAMP
                    )
                },
            ],
            zIndex: Math.round(interpolate(
                scrollX.value,
                [(index-1) * width, index *width, (index+1) * width], 
                [0,10,0],
                Extrapolation.CLAMP
            ))
        }
    })

    return (
        <Animated.View style={[{width:width}, rnAnimatedStyle]} className="flex justify-center items-center">
            <Link
                href={{
                pathname: "/content/[id]",
                    params: {
                        id: `${item.id}${item.hasOwnProperty("title") ? 1 : 0}`,
                    },
                }}
            >      
            <Image
                source={{
                    uri: item.image,
                }}
                style={{
                    width: 200,
                    height: 300,
                }}
                className="rounded-xl m-6"
            />
            </Link>
        </Animated.View>
    )
}