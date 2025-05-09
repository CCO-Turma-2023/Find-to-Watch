import { Text, View, Pressable } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { PROVIDER_GOOGLE } from "react-native-maps"
import React, { useEffect, useState } from 'react';
import MapView, { Marker, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { getTheaterInfo } from "@/services/scrap";
import {Link, router} from "expo-router"


export default function Filmes(){
    return(
        <View className="bg-black flex-1">
            <View className="m-2 flex flex-col gap-2 ">
                <Text className="text-white">Cinemas</Text>
                <View className="flex flex-row">
                    <Link href={"/theater"} className={`p-2 flex flex-row border border-white rounded-xl`}>
                        <AntDesign name="plus" color="white" size={20}></AntDesign>
                    </Link>
                </View>
            </View>
        </View>    
        )
}

