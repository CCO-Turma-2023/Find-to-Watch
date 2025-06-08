import { MovieSearchProps } from "@/interfaces/search-interface";
import { mergeNowPlaying, fetchIntercalatedCategory, initialRequestMovie, initialRequestTVShow } from "@/services/searchContent";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { filters } from "@/interfaces/filters";

interface ContextHomeType {
  fixedMedia: MovieSearchProps[][],
  dynamicMedia: MovieSearchProps[][],
  filtrar: (filtros: filters) => void,
  loading: boolean
}

const ContextHome = createContext<ContextHomeType | undefined>(undefined);

export const ProviderHome = ({ children }: { children: ReactNode }) => {
  const [filtersState, setFiltersState] = useState<filters>({
    movie: [28],
    tv: [10759]
  });
  const [loading, setLoading] = useState(true);

  const filtrar = (filtros: filters) => {
    setFiltersState(prev => {
      const isEqual =
        JSON.stringify(prev.movie) === JSON.stringify(filtros.movie) &&
        JSON.stringify(prev.tv) === JSON.stringify(filtros.tv);
      return isEqual ? prev : filtros;
    });
  };

  const [fixedMedia, setFixedMedia] = useState<MovieSearchProps[][]>([]);
  const [dynamicMedia, setDynamicMedia] = useState<MovieSearchProps[][]>([]);
  
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [dynamicDataLoaded, setDynamicDataLoaded] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      const np = await mergeNowPlaying();
      const ea = await fetchIntercalatedCategory(0, 21);
      setFixedMedia([np, ea]);
      setInitialDataLoaded(true);
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      const fetchDynamicData = async () => {
        const mv = await initialRequestMovie(filtersState.movie);
        const tv = await initialRequestTVShow(filtersState.tv);
        setDynamicMedia([mv, tv]);
        setDynamicDataLoaded(true);
      };
      fetchDynamicData();
    }, 500); 

    return () => clearTimeout(debounceTimeout);
  }, [filtersState]);

  useEffect(() => {
    if (initialDataLoaded && dynamicDataLoaded) {
      setLoading(false);
    }
  }, [initialDataLoaded, dynamicDataLoaded]);

  return (
    <ContextHome.Provider value={{ fixedMedia, dynamicMedia, loading, filtrar }}>
      {children}
    </ContextHome.Provider>
  );
};

export const useContextHome = () => {
  const context = useContext(ContextHome);
  if (!context)
    throw new Error("useContextHome deve ser usado dentro de um MyProvider");
  return context;
};
