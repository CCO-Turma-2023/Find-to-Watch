import axios from "axios";
import Constants from "expo-constants";

const { tmdbToken, omdbToken } = Constants.expoConfig?.extra || {};

export const api = axios.create({
  baseURL: "https://api.themoviedb.org/",
  timeout: 10000, // tempo limite de requisição
});

export const omdb = axios.create({
  baseURL: `https://www.omdbapi.com/?apikey=${omdbToken}`,
  timeout: 10000,
})

export const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: tmdbToken,
  },
};
