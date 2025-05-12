import { View, Text, TextInput, Keyboard, TouchableOpacity, ScrollView, Pressable } from "react-native";
import { StatusBar } from "expo-status-bar";
import { PROVIDER_GOOGLE } from "react-native-maps"
import React, { useEffect, useState, useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { getTheaterInfo } from "@/services/scrap";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { router } from "expo-router";
import { TheaterInterface } from "@/interfaces/theater-interface";
import { useContextCinema } from "@/contexts/ContextCinema";
import { useLocation } from "@/contexts/ContextLocation";


export default function Theater(){
        const { region, theaters, subregion, setTheaters } = useLocation(); 
        const [showMap, setShowMap] = useState(true)
        const [busca, setBusca] = useState("");
        const { setCine } = useContextCinema();

        const buscarCinemas = async () => {
            setShowMap(false)
            try {
            if (!busca.trim()) return;
            const theatersInfo = await getTheaterInfo(busca.trim());
            setTheaters(theatersInfo);
            Keyboard.dismiss();
            } catch (error) {
            console.error("Erro na busca:", error);
            }
        };

        const onPress = (cinema : TheaterInterface) => {
            setCine(cinema);
            router.dismiss();
        }

        useEffect(() => {
            (async () => {
                if (busca.trim() === "") {
                    setShowMap(true);
                    const theatersInfo = await getTheaterInfo(subregion);
                    setTheaters(theatersInfo);
                }
            })();
        }, [busca]);


    if (!region) return null;

    return (
        <View className="flex flex-1 flex-col bg-black p-2">
            <StatusBar style="light" backgroundColor="black" translucent={false} />

            <Pressable className="mb-4" onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={30} color="#ffffff" />
            </Pressable>
            <View className="mb-4 flex flex-row items-center gap-2 rounded border border-gray-400 p-2">
                <AntDesign name="search1" color={"white"} size={20} />
                <TextInput
                className="ml-2 flex-1 text-white"
                placeholder="Busque uma cidade"
                placeholderTextColor="gray"
                value={busca}
                onChangeText={setBusca}
                onSubmitEditing={buscarCinemas} // Pressionar "OK" no teclado
                returnKeyType="search"
                />
                <TouchableOpacity onPress={buscarCinemas}>
                    <AntDesign name="arrowright" size={24} color="white" />
                </TouchableOpacity>
            </View>
            <View className="flex flex-1 flex-col items-center">
                {showMap && (
                    <MapView 
                    style={{ width: '50%', height: '50%' }} 
                    provider={PROVIDER_GOOGLE}
                    region={region}
                    >
                        <Marker coordinate={region} />
                    </MapView>)
                }
                    
          
            {theaters && (
            <ScrollView className="mt-4 w-full" showsVerticalScrollIndicator={false}>
                {theaters.map((t, index) => (
                <View key={index} className="mb-4">
                    <Pressable className="rounded-xl border border-white p-2" onPress={() => onPress(t)} >
                        <Text className="text-white text-lg font-semibold">
                        {t.cinema}
                        </Text>
                        <Text className="text-white text-sm">
                        {t.endereco}
                        </Text>
                    </Pressable>
                </View>
               
                ))}
            </ScrollView>
            )}
            </View>
        </View>
    )

}