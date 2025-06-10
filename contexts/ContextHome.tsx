import { MovieSearchProps } from "@/interfaces/search-interface";
import { mergeNowPlaying, fetchIntercalatedCategory, initialRequestMovie, initialRequestTVShow } from "@/services/searchContent";
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
} from "react";
import { filters, Filtro } from "@/interfaces/filters";


interface ContextHomeType {
  Media: {id: number, media: MovieSearchProps[][], hasSubSections: boolean, subSections?:any}[],
  filmesFilter: {
    titulo: string;
    index: number;
    id: number;
    page: number;
  }[], 
  seriesFilter: {
    titulo: string;
    index: number;
    id: number;
    page: number;
  }[],
  incPage: (index:number, type: "movie" | "tv") => void
  loading: boolean
}

const movies = [
    {titulo: "Ação", index: 0, id: 28, page: 1},
    {titulo: "Drama", index: 1, id: 18, page: 1},
    {titulo: "Comédia", index: 2, id: 35, page: 1},
    {titulo: "Animação", index: 3, id: 16, page: 1},
    {titulo: "Documentário", index: 4, id: 99, page: 1},
    {titulo: "Terror", index: 5, id: 27, page: 1},
    {titulo: "Romance", index: 6,  id: 10749, page: 1},
    {titulo: "Sci-Fi", index: 7,  id: 878, page: 1},
    {titulo: "Musical", index: 8,  id: 10402, page: 1},
    {titulo: "História", index: 9, id: 36, page: 1},
    {titulo: "Suspense", index: 10, id: 53, page: 1},
]

const series = [
    {titulo: "Ação e Aventura", index: 0, id: 10759, page: 1},
    {titulo: "Drama", index: 1, id: 18, page: 1},
    {titulo: "Comédia", index: 2, id: 35, page: 1},
    {titulo: "Animação", index: 3, id: 16, page: 1},
    {titulo: "Documentário", index: 4,  id: 99, page: 1},
    {titulo: "Infantil", index: 5,  id: 10762, page: 1},
    {titulo: "Mistério", index: 10, id: 9648, page: 1},
    {titulo: "Fantasia", index: 7,  id: 10765, page: 1},
    {titulo: "Reality Show", index: 8,  id: 10764, page: 1},
    {titulo: "Romance", index: 6,  id: 10749, page: 1},
    {titulo: "História", index: 9, id: 36, page: 1}, 
]

const ContextHome = createContext<ContextHomeType | undefined>(undefined);

export const ProviderHome = ({ children }: { children: ReactNode }) => {
  const [filmesFilter, setFilmesFilter] = useState<{
    titulo: string;
    index: number;
    id: number;
    page: number;
  }[]>(movies)
  const [seriesFilter, setSeriesFilter] = useState<{
    titulo: string;
    index: number;
    id: number;
    page: number;
  }[]>(series)
  const [loading, setLoading] = useState(true);
  const [Media, setMedia] = useState<{id: number, media: MovieSearchProps[][], hasSubSections: boolean, subSections?:any}[]>([]);
  const filmesFilterRef = useRef<{
    titulo: string;
    index: number;
    id: number;
    page: number;
  }[]>(movies);
  const seriesFilterRef = useRef<{
    titulo: string;
    index: number;
    id: number;
    page: number;
  }[]>(series);
  const [initialRequest, setInitialRequest] = useState(true)

  const incPage = (
    index: number,
    type: "movie" | "tv"
  ) => {
    if (type === "movie") {

      setFilmesFilter(prevFilmesFilter => {
        
        const updatedFilmesFilter = prevFilmesFilter.map(item => {
          if (item.index === index) {
            
            return { ...item, page: item.page + 1 };
          }
          
          return item;
        });

        return updatedFilmesFilter;
      });
    }else{
      setSeriesFilter(prevSeriesFilter => {
        
        const updatedSeriesFilter = prevSeriesFilter.map(item => {
          if (item.index === index) {
            
            return { ...item, page: item.page + 1 };
          }
          
          return item;
        });
        return updatedSeriesFilter;
      });
    }
  }

  useEffect(() => {
    const fetchInitialData = async () => {
      const np = await mergeNowPlaying();
      const ea = await fetchIntercalatedCategory(0, 1);
      const mv = await Promise.all (filmesFilter.map( async (mv) => {
        return await initialRequestMovie(mv)
      }))
      const tv = await Promise.all (seriesFilter.map( async (tv) => {
        return await initialRequestTVShow(tv)
      }))
      setMedia([{id: 0, media: [np], hasSubSections:false}, 
        {id: 1, media: [ea], hasSubSections: false},
        {id: 2, media: mv, hasSubSections: true, subSections: filmesFilter},
        {id: 3, media: tv, hasSubSections: true, subSections: seriesFilter}]);
      setLoading(false);
      setInitialRequest(false)
    };
    fetchInitialData();
  }, []);


  useEffect(() => {
    if(!initialRequest){
      const prevFilmesFilter = filmesFilterRef.current;
      filmesFilterRef.current = filmesFilter;

      // Detecta quais filtros mudaram (mudança de página)
      const filtrosAlterados = filmesFilter.filter(current => {
        const prev = prevFilmesFilter.find(p => p.id === current.id);
        return !prev || prev.page !== current.page;
      });

      const fetchFilme = async () => {
        const novasMedias = await Promise.all(
          filtrosAlterados.map(async (mv) => {
            const result = await initialRequestMovie(mv);
            return { filtro: mv, resultados: result };
          })
        );

        setMedia(prev => {
          return prev.map(section => {
            if (section.id === 2) {
              // Atualiza apenas as partes da media que tiveram page alterada
              const novaMedia = [...section.media]; // Cópia do array original

              novasMedias.forEach(({ filtro, resultados }) => {
                const index = section.subSections.findIndex((f : any) => f.id === filtro.id);
                if (index !== -1) {
                  // Insere os novos resultados no início da respectiva posição
                  const antigosResultados = section.media[index] || [];
                  novaMedia[index] = [...antigosResultados, ...resultados];
                }
              });

              return {
                ...section,
                media: novaMedia,
                subSections: filmesFilter,
              };
            }
            return section;
          });
        });
      };

      fetchFilme();
      }
    
  }, [filmesFilter]);

  useEffect(() => {
    if(!initialRequest){
      const prevSeriesFilter = seriesFilterRef.current;
      seriesFilterRef.current = seriesFilter;

      // Detecta quais filtros mudaram (mudança de página)
      const SeriesAlteradas = seriesFilter.filter(current => {
        const prev = prevSeriesFilter.find(p => p.id === current.id);
        return !prev || prev.page !== current.page;
      });

      const fetchSeries = async () => {
        const novasMedias = await Promise.all(
          SeriesAlteradas.map(async (tv) => {
            const result = await initialRequestTVShow(tv);
            return { filtro: tv, resultados: result };
          })
        );

        setMedia(prev => {
          return prev.map(section => {
            if (section.id === 3) {
              // Atualiza apenas as partes da media que tiveram page alterada
              const novaMedia = [...section.media]; // Cópia do array original

              novasMedias.forEach(({ filtro, resultados }) => {
                const index = section.subSections.findIndex((f : any) => f.id === filtro.id);
                if (index !== -1) {
                  // Insere os novos resultados no início da respectiva posição
                  const antigosResultados = section.media[index] || [];
                  novaMedia[index] = [...antigosResultados, ...resultados];
                }
              });

              return {
                ...section,
                media: novaMedia,
                subSections: seriesFilter,
              };
            }
            return section;
          });
        });
      };

      fetchSeries();
      }
    
  }, [seriesFilter]);

  return (
    <ContextHome.Provider value={{ Media, loading, filmesFilter, seriesFilter, incPage }}>
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
