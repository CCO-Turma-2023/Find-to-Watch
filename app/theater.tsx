import {
  View,
  Text,
  TextInput,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Image
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { PROVIDER_GOOGLE } from "react-native-maps";
import React, { useEffect, useState, useRef } from "react";
import MapView, { Marker } from "react-native-maps";
import { getTheaterInfo } from "@/services/scrap";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { router } from "expo-router";
import { TheaterInterface } from "@/interfaces/theater-interface";
import { useContextCinema } from "@/contexts/ContextCinema";
import { useLocation } from "@/contexts/ContextLocation";
import * as Location from 'expo-location';

interface MarkerProps{
  latitude: number;
  longitude: number;
  cinema: string;
}

export default function Theater() {
  const { region, theaters, subregion, setTheaters } = useLocation();
  const [showMap, setShowMap] = useState(true);
  const [busca, setBusca] = useState("");
  const { setCine, cinemas } = useContextCinema();
  const [markers, setMarkers] = useState<MarkerProps[]>([]);
  const mapRef = useRef<MapView | null>(null);

  const buscarCinemas = async () => {
    setShowMap(false);
    try {
      if (!busca.trim()) return;
      let theatersInfo = await getTheaterInfo(busca.trim());

      theatersInfo = theatersInfo.filter((t:any) => {
        return  !cinemas.some((c) => c.codigo === t.codigo)
      })

      setTheaters(theatersInfo);

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
      setShowMap(true);

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

  useEffect(() => {
    if ((markers.length > 0 || region) && mapRef.current) {
      const coordinates = [
        ...markers.map(m => ({
          latitude: m.latitude,
          longitude: m.longitude,
        })),
      ];

      if (region) {
        coordinates.push({
          latitude: region.latitude,
          longitude: region.longitude,
        });
      }

      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, [markers, region]);


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
            ref={mapRef}
            style={{ width: "70%", height: "70%" }}
            provider={PROVIDER_GOOGLE}
            region={region}
          >
            <Marker coordinate={region} title="Sua Localização"></Marker>
            {markers && markers.map((marker, index) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}
                pinColor="yellow"
                title={marker.cinema}
              >
              </Marker>
            ))}
          </MapView>
        )}

        {theaters && (
          <ScrollView
            className="mt-4 w-full"
            showsVerticalScrollIndicator={false}
          >
            {theaters.map((t, index) => (
              <View key={index} className="mb-4">
                <Pressable
                  className="rounded-xl border border-white p-2"
                  onPress={() => onPress(t)}
                >
                  <Text className="text-lg font-semibold text-white">
                    {t.cinema}
                  </Text>
                  <Text className="text-sm text-white">{t.endereco}</Text>
                </Pressable>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}
