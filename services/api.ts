import axios from "axios";
import token from "../token.json";

export const api = axios.create({
  baseURL: "https://api.themoviedb.org/", // substitua pela URL da sua API
  timeout: 10000, // opcional: tempo limite de requisição
});

export const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: token.Authorization,
  },
};
