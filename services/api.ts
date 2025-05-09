import axios from "axios";
import Constants from 'expo-constants';

const { tmdbToken } = Constants.expoConfig?.extra || {};

export const api = axios.create({
  baseURL: "https://api.themoviedb.org/", // substitua pela URL da sua API
  timeout: 10000, // opcional: tempo limite de requisição
});

export const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: tmdbToken
  },
};
