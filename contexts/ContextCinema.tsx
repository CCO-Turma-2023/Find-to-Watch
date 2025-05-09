import { MovieSearchProps } from "@/interfaces/search-interface";
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
}

const ContextCinema = createContext<ContextCinemaType | undefined>(undefined);

export const ProviderCinema = ({ children }: { children: ReactNode }) => {
  const [media, setMedia] = useState<MovieSearchProps[][]>([]);

  useEffect(() => {
      const fetchData = async () => {
        const categories = await initialRequestCinema();
        setMedia(categories);
      };
  
      fetchData();
    }, []);

  return (
    <ContextCinema.Provider value={{ media, setMedia }}>
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
