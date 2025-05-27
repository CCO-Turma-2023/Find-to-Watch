import { MovieSearchProps } from "@/interfaces/search-interface";
import { TheaterInterface } from "@/interfaces/theater-interface";
import { initialRequestCinema } from "@/services/searchContent";
import AsyncStorage from "@react-native-async-storage/async-storage";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface ContextCinemaType {
  media: MovieSearchProps[][];
  setMedia: React.Dispatch<React.SetStateAction<MovieSearchProps[][]>>;
  cinemas: TheaterInterface[];
  setCinemas: React.Dispatch<React.SetStateAction<TheaterInterface[]>>;
  setCine: (c: TheaterInterface) => void;
  removeCine: (codigo: string) => void;
  getAllDataFromAsyncStorage: () => Promise<TheaterInterface[]>;
}

const ContextCinema = createContext<ContextCinemaType | undefined>(undefined);

export const ProviderCinema = ({ children }: { children: ReactNode }) => {
  const [media, setMedia] = useState<MovieSearchProps[][]>([]);
  const [cinemas, setCinemas] = useState<TheaterInterface[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const categories = await initialRequestCinema();
      setMedia(categories);
    };

    fetchData();
  }, []);

  async function setCine(cinema: TheaterInterface) {
    const exists = cinemas.find((c) => c.codigo === cinema.codigo);

    if (!exists) {
      await AsyncStorage.setItem(
        cinema.codigo,
        JSON.stringify({ cinema: cinema.cinema, endereco: cinema.endereco }),
      );
      setCinemas((prev) => [...prev, cinema]);
    }
  }

  async function removeCine(codigo: string) {
    try {
      await AsyncStorage.removeItem(codigo);
      setCinemas((prev) => prev.filter((c) => c.codigo !== codigo));
    } catch (error) {
      console.error("Erro ao remover cinema do AsyncStorage:", error);
    }
  }

  async function getAllDataFromAsyncStorage(): Promise<TheaterInterface[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const stores = await AsyncStorage.multiGet(keys);

      const result: TheaterInterface[] = stores.map(([codigo, value]) => {
        if (value) {
          const c = JSON.parse(value);
          return {
            codigo,
            cinema: c.cinema ?? "",
            endereco: c.endereco ?? "",
          };
        } else {
          return {
            codigo,
            cinema: "",
            endereco: "",
          };
        }
      });

      return result;
    } catch (error) {
      console.error("Erro ao obter dados do AsyncStorage:", error);
      return [];
    }
  }

  return (
    <ContextCinema.Provider
      value={{
        media,
        setMedia,
        cinemas,
        setCine,
        setCinemas,
        removeCine,
        getAllDataFromAsyncStorage,
      }}
    >
      {children}
    </ContextCinema.Provider>
  );
};

export const useContextCinema = () => {
  const context = useContext(ContextCinema);
  if (!context)
    throw new Error("useContextCinema deve ser usado dentro de um MyProvider");
  return context;
};
