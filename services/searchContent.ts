import axios from "axios";
import { api, options } from "./api";
import { MovieSearchProps } from "@/interfaces/search-interface";
import React, { useState } from "react";
import { useContextHome } from "@/contexts/ContextHome";

export const requestContents = async (
  mediaSearch: string,
  setMedias: React.Dispatch<React.SetStateAction<MovieSearchProps[]>>,
) => {
  const defaultUrl = `query=${mediaSearch}&include_adult=false&language=pt-BR&page=1`;
  try {
    const resp = await api.get(`3/search/movie?${defaultUrl}`, options);
    const resp2 = await api.get(`3/search/tv?${defaultUrl}`, options);

    for (let i in resp2.data.results) {
      resp2.data.results[i]["title"] = resp2.data.results[i]["name"];
      delete resp2.data.results[i]["nome"];
    }

    setMedias([...resp.data.results, ...resp2.data.results]);
  } catch (error) {
    console.error("Erro ao buscar filmes:", error);
  }
};

export const initialRequest = async (): Promise<MovieSearchProps[]> => {
  try {
    const NowPlaying = await api.get(
      "3/movie/now_playing?language=pt-br&page=1",
      options,
    );
    return NowPlaying.data.results;
  } catch (error) {
    console.error("Erro ao buscar filmes:", error);
    return []; // Retorna array vazio se der erro
  }
};
