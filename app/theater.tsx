import { View, Text, TextInput, Keyboard, TouchableOpacity, ScrollView, Pressable } from "react-native";
import { StatusBar } from "expo-status-bar";
import { PROVIDER_GOOGLE } from "react-native-maps"
import React, { useEffect, useState } from 'react';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { getTheaterInfo } from "@/services/scrap";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { router } from "expo-router";

interface TheaterInterface{
    cinema:string,
    endereco: string
}

export default function Theater(){
        const [region, setRegion] = useState<Region | null>(null);
        const [theaters, setTheaters] = useState<TheaterInterface[] | null>(null)
        const [showMap, setShowMap] = useState(true)
        const [busca, setBusca] = useState("");

        const buscarTeatros = async () => {
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
    
        useEffect(() => {
        if (busca.trim() === "") {
            (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Permissão negada!');
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });

            const reverseGeocode = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            const subregion = reverseGeocode[0]?.subregion;

            if (subregion) {
                const theatersInfo = await getTheaterInfo(subregion);
                setTheaters(theatersInfo);
                setShowMap(true);
            }
            })();
        }
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
                onSubmitEditing={buscarTeatros} // Pressionar "OK" no teclado
                returnKeyType="search"
                />
                <TouchableOpacity onPress={buscarTeatros}>
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
                    <Text className="text-white text-lg font-semibold">
                    {t.cinema}
                    </Text>
                    <Text className="text-white text-sm">
                    {t.endereco}
                    </Text>
                </View>
               
                ))}
            </ScrollView>
            )}
            </View>
        </View>
    )

}