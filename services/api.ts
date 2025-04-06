import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3/search/', // substitua pela URL da sua API
  timeout: 10000, // opcional: tempo limite de requisição
});



