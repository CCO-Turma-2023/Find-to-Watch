import { MovieSearchProps } from "@/interfaces/search-interface";
import { initialRequestMovie } from "@/services/searchContent";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface ContextMovieType {
  media: MovieSearchProps[][];
  setMedia: React.Dispatch<React.SetStateAction<MovieSearchProps[][]>>;
}

const ContextMovie = createContext<ContextMovieType | undefined>(undefined);

export const ProviderMovie = ({ children }: { children: ReactNode }) => {
  const [media, setMedia] = useState<MovieSearchProps[][]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const categories = await initialRequestMovie();
      setMedia(categories);
    };
  
    fetchData();
  }, []);

  return (
    <ContextMovie.Provider value={{ media, setMedia }}>
      {children}
    </ContextMovie.Provider>
  );
};

export const useContextMovie = () => {
  const context = useContext(ContextMovie);
  if (!context)
    throw new Error("useContextMovie deve ser usado dentro de um MyProvider");
  return context;
};
