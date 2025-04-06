import axios from "axios";
import { api, options } from "./api";
import { MovieSearchProps } from "@/interfaces/search-interface";
import React from "react";

export const requestContents = async (
  mediaSearch: string,
  setMedias: React.Dispatch<React.SetStateAction<MovieSearchProps[]>>
) => {
  const defaultUrl = `query=${mediaSearch}&include_adult=false&language=pt-BR&page=1`;
  try {
    const resp = await api.get(
      `movie?${defaultUrl}`,
      options
    );
    const resp2 = await api.get(
      `tv?${defaultUrl}`,
      options
    );

    for (let i in resp2.data.results)
    {
        resp2.data.results[i]['title'] = resp2.data.results[i]['name'];
        delete resp2.data.results[i]['nome'];
    }

    setMedias([...resp.data.results, ...resp2.data.results]);
  } catch (error) {
    console.error("Erro ao buscar filmes:", error);
  }
};
