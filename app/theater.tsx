import {
  View,
  Text,
  TextInput,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { PROVIDER_GOOGLE } from "react-native-maps";
import React, { useEffect, useState, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import { getTheaterInfo } from "@/services/scrap";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import { TheaterInterface } from "@/interfaces/theater-interface";
import { useContextCinema } from "@/contexts/ContextCinema";
import { useLocation } from "@/contexts/ContextLocation";
import * as Location from 'expo-location';
import { StyleSheet } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";

interface MarkerProps{
  latitude: number;
  longitude: number;
  cinema: string;
}

interface City{
  latitude: number,
  longitude: number,
  latitudeDelta: number;
  longitudeDelta: number;
}

export default function Theater() {
  const {region, theaters, subregion, setTheaters } = useLocation();
  const [city, setCity] = useState <City | null>(null)
  const [busca, setBusca] = useState("");
  const { setCine, cinemas } = useContextCinema();
  const [markers, setMarkers] = useState<MarkerProps[]>([]);

  const buscarCinemas = async () => {
    try {
      if (!busca.trim()) return;
      let theatersInfo = await getTheaterInfo(busca.trim());

      theatersInfo = theatersInfo.filter((t:any) => {
        return  !cinemas.some((c) => c.codigo === t.codigo)
      })

      setTheaters(theatersInfo);

      const geocodedLocations = await Location.geocodeAsync(busca.trim());
      if (geocodedLocations.length > 0) {
        const { latitude, longitude } = geocodedLocations[0];
        setCity ({ latitude, longitude, latitudeDelta:0.15, longitudeDelta:0.15 })
      }

      const coordinates = await Promise.all(
        theatersInfo.map(async (t: any) => {
          try {
            const results = await Location.geocodeAsync(t.endereco);
            if (results.length > 0) {
              const { latitude, longitude } = results[0];
              return {
                latitude,
                longitude,
                cinema: t.cinema,
              };
            } else {
              console.warn("Endereço não encontrado:", t.endereco);
              return null;
            }
          } catch (error) {
            console.error("Erro ao geocodificar:", t.endereco, error);
            return null;
          }
        })
      );

      const validMarkers = coordinates.filter(Boolean);
      setMarkers(validMarkers);

      Keyboard.dismiss();
    } catch (error) {
      console.error("Erro na busca:", error);
    }
  };

  const onPress = (cinema: TheaterInterface) => {
    setCine(cinema);
    router.dismiss();
  };

useEffect(() => {
  (async () => {
    if (busca.trim() === "") {
      setCity(null)

      let theatersInfo = await getTheaterInfo(subregion);

      theatersInfo = theatersInfo.filter((t: any) => {
        return !cinemas.some((c) => c.codigo === t.codigo);
      });

      const coordinates = await Promise.all(
        theatersInfo.map(async (t: any) => {
          try {
            const results = await Location.geocodeAsync(t.endereco);
            if (results.length > 0) {
              const { latitude, longitude } = results[0];
              return {
                latitude,
                longitude,
                cinema: t.cinema,
              };
            } else {
              console.warn("Endereço não encontrado:", t.endereco);
              return null;
            }
          } catch (error) {
            console.error("Erro ao geocodificar:", t.endereco, error);
            return null;
          }
        })
      );

      const validMarkers = coordinates.filter(Boolean);
      setMarkers(validMarkers);

      setTheaters(theatersInfo);
    }
  })();
}, [busca]);


  if (!region) return null;

  return (
  <View className="flex-1 relative">
    <Pressable className="absolute mt-10 ml-5 p-3 bg-[rgba(31,45,55,0.8)] rounded-full z-50" onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={30} color="#ffffff" />
    </Pressable>
    {/* Mapa ocupando a tela toda */}
    <MapView
      style={StyleSheet.absoluteFillObject}
      provider={PROVIDER_GOOGLE}
      region={city || region}
    >
      {!city && <Marker coordinate={region} title="Sua Localização" />}
      {markers && markers.map((marker, index) => (
        <Marker
          key={index}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          pinColor="yellow"
          title={marker.cinema}
        />
      ))}
    </MapView>

    {/* Status bar */}
    <StatusBar style="light" backgroundColor="black" translucent={false} />

    {/* Campo de busca */}
    <View
      className="flex-row items-center gap-2 border border-gray-400  rounded-3xl bg-[rgba(31,45,55,0.8)]"
      style={{
        position: "absolute",
        top: 100,
        left: 20,
        right: 20,
        zIndex: 10,
        paddingInline: 15,
        paddingVertical: 10
      }}
    >
      <AntDesign name="search1" color={"white"} size={20} />
      <TextInput
        className="ml-2 flex-1 text-white"
        placeholder="Busque uma cidade"
        placeholderTextColor="gray"
        value={busca}
        onChangeText={setBusca}
        onSubmitEditing={buscarCinemas}
        returnKeyType="search"
      />
      <TouchableOpacity onPress={buscarCinemas}>
        <AntDesign name="arrowright" size={24} color="white" />
      </TouchableOpacity>
    </View>

    {/* Lista de cinemas */}
    {theaters && (
    <ScrollView
      className="w-full px-4"
      style={{
        position: "absolute",
        bottom: 20,
        maxHeight: 300,
        overflow: 'visible'
      }}
      horizontal
      showsHorizontalScrollIndicator={false}
    >
      {theaters.map((t, index) => (
        <View
          style={{ width: 180, overflow: 'visible' }}
          key={index}
          className="mb-4 mr-4"
        >
          <View
            style={{
              position: "absolute",
              top: -30,
              left: 65,
              zIndex: 10,
              width: 50,
              height: 50,
              overflow: "hidden",
              borderWidth: 2,
              borderColor: "white",
              backgroundColor: "#1A1A1A", // Fundo para o ícone
              justifyContent: "center",
              alignItems: "center",
            }}
            className="rounded-2xl"
          >
            <Feather name="film" size={24} color="white" />
          </View>

          <Pressable
            className="rounded-2xl flex gap-1 border border-white p-4 bg-[#1A1A1A]"
            style={{paddingTop:30}}
            onPress={() => onPress(t)}
          >
            <Text className="text-lg font-semibold text-white">
              {t.cinema}
            </Text>
            <Text className="text-md text-white">{t.endereco}</Text>
          </Pressable>
        </View>
      ))}
    </ScrollView>
  )}
</View>
);
}
