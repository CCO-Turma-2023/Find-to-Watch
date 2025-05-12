import { MovieSearchProps } from "@/interfaces/search-interface";
import { TheaterInterface } from "@/interfaces/theater-interface";
import { initialRequestCinema } from "@/services/searchContent";

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
  setCine: (c: TheaterInterface) => void;
}

const ContextCinema = createContext<ContextCinemaType | undefined>(undefined);

export const ProviderCinema = ({ children }: { children: ReactNode }) => {
  const [media, setMedia] = useState<MovieSearchProps[][]>([]);
  const [cinemas, setCinemas] = useState<TheaterInterface[]>([])

  useEffect(() => {
      const fetchData = async () => {
        const categories = await initialRequestCinema();
        setMedia(categories);
      };
  
      fetchData();
    }, []);

    function setCine(cinema: TheaterInterface) {
      setCinemas(prev => {
        const exists = prev.find(Cinema => Cinema.codigo === cinema.codigo);
        if (!exists) {
          return [...prev, cinema];
        }
        return prev;
      });
    }

  return (
    <ContextCinema.Provider value={{ media, setMedia, cinemas, setCine }}>
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
