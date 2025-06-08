import React, { useEffect, useRef } from "react";
import { Animated, TouchableWithoutFeedback, View } from "react-native";
import { useIsFocused } from "@react-navigation/native";

export default function CustomTabBarButton({ children, onPress }: any) {
  const isFocused = useIsFocused();

  const scale = useRef(new Animated.Value(isFocused ? 1.2 : 1)).current;
  const opacity = useRef(new Animated.Value(isFocused ? 1 : 0.7)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: isFocused ? 1.2 : 1,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: isFocused ? 1 : 0.7,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isFocused]);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Animated.View
        style={{
          transform: [{ scale }],
          opacity,
          top: isFocused ? -30 : 0,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {isFocused ? (
          
          <View className="flex justify-center items-center flex w-20 p-5 rounded-full">
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 35,
                backgroundColor: "red",
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.25,
                shadowRadius: 3.5,
                elevation: 5,
              }}
            >
              {children}
            </View>
          </View>
        ) : (
          children
        )}
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}
