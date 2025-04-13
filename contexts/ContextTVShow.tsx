import { MovieSearchProps } from "@/interfaces/search-interface";
import { initialRequestTVShow } from "@/services/searchContent";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface ContextTVShowType {
  media: MovieSearchProps[][];
  setMedia: React.Dispatch<React.SetStateAction<MovieSearchProps[][]>>;
}

const ContextTVShow = createContext<ContextTVShowType | undefined>(undefined);

export const ProviderTVShow = ({ children }: { children: ReactNode }) => {
  const [media, setMedia] = useState<MovieSearchProps[][]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const categories = await initialRequestTVShow();
      setMedia(categories);
    };
  
    fetchData();
  }, []);

  return (
    <ContextTVShow.Provider value={{ media, setMedia }}>
      {children}
    </ContextTVShow.Provider>
  );
};

export const useContextTVShow = () => {
  const context = useContext(ContextTVShow);
  if (!context)
    throw new Error("useContextTVShow deve ser usado dentro de um MyProvider");
  return context;
};
