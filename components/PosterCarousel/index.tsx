import { View, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useDerivedValue,
  scrollTo,
  useAnimatedRef,
} from "react-native-reanimated";
import SliderItem from "./slider";
import Pagination from "./pagination";
import { useEffect, useRef, useState } from "react";

const { width } = Dimensions.get("window");

export default function PosterCarousel({ posters }: any) {
  const scrollX = useSharedValue(0);
  const offset = useSharedValue(0);
  const [paginationIndex, setPaginationIndex] = useState(0);
  const [data, setData] = useState(posters);
  const ref = useAnimatedRef<Animated.ScrollView>();
  const [isAutoPlay, setAutoPlay] = useState(true);
  const interval = useRef<NodeJS.Timeout>();

  const ITEM_WIDTH = 250;
  const SPACER = (width - ITEM_WIDTH) / 4;

  const extendedData = [{ key: "left-spacer" }, ...data, { key: "right-spacer" }];

  const onScrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
    onMomentumEnd: (e) => {
      offset.value = e.contentOffset.x;
    },
  });

  useEffect(() => {
    if (isAutoPlay) {
      interval.current = setInterval(() => {
        offset.value = offset.value + ITEM_WIDTH;
      }, 5000);
    } else {
      clearInterval(interval.current);
    }

    return () => {
      clearInterval(interval.current);
    };
  }, [isAutoPlay, offset]);

  useDerivedValue(() => {
    scrollTo(ref, offset.value, 0, true);
  });

  const handleScrollEnd = (event: any) => {
    const currentOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(currentOffset / ITEM_WIDTH);
    setPaginationIndex(index % posters.length);

    if (index >= extendedData.length - 3) {
      setData((prev: any) => [...prev, ...posters]);
    }
  };

  return (
    <View>
      <Animated.ScrollView
        ref={ref}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        scrollEventThrottle={16}
        onScroll={onScrollHandler}
        onScrollBeginDrag={() => setAutoPlay(false)}
        onScrollEndDrag={() => setAutoPlay(true)}
        onMomentumScrollEnd={handleScrollEnd}
        contentContainerStyle={{ paddingHorizontal: SPACER }}
      >
        {extendedData.map((item, index) => {
          if (!item.image) {
            return <View key={index} style={{ width: SPACER }} />;
          }

          return (
            <View key={index} style={{ width: ITEM_WIDTH }}>
              <SliderItem item={item} index={index - 1} scrollX={scrollX} />
            </View>
          );
        })}
      </Animated.ScrollView>

      <Pagination
        items={posters}
        scrollX={scrollX}
        paginationIndex={paginationIndex}
      />
    </View>
  );
}
