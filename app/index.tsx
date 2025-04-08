import {
  Text,
  View,
  TextInput,
  Pressable,
  Button,
  Image,
  ScrollView,
} from "react-native";
import { Link } from "expo-router";
import axios from "axios";
import Header from "@/components/HeaderComponent";
import { useEffect, useState } from "react";
import { MovieSearchProps } from "@/interfaces/search-interface";
import { ProviderHome, useContextHome } from "@/contexts/ContextHome";
import ShowMedia from "@/components/HomeShowMedia";
import Home from "../components/HomeMedia";

export default function Index() {
  return (
    <View style={{ flex: 1 }} className="bg-black">
      <ProviderHome>
        <Header />
        <Home />
      </ProviderHome>
    </View>
  );
}
