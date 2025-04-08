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
  import { useEffect, useState } from "react";
  import { MovieSearchProps } from "@/interfaces/search-interface";
  import { ProviderHome, useContextHome } from "@/contexts/ContextHome";
  import ShowMedia from "@/components/HomeShowMedia";
  import Home from "../../components/HomeMedia";
  
  export default function Index() {
    return (
      <View className="bg-black flex-1">
          <Home />
      </View>
    );
  }
  