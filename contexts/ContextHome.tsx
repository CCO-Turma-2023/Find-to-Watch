import { MovieSearchProps } from '@/interfaces/search-interface';
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ContextHomeType {
  media: MovieSearchProps[];
  setMedia: React.Dispatch<React.SetStateAction<MovieSearchProps[]>>;
}

const ContextHome = createContext<ContextHomeType | undefined>(undefined);

export const ProviderHome = ({ children }: { children: ReactNode }) => {
  const [media, setMedia] = useState<MovieSearchProps[]>([]);

  return (
    <ContextHome.Provider value={{ media, setMedia }}>
      {children}
    </ContextHome.Provider>
  );
};

export const useContextHome = () => {
  const context = useContext(ContextHome);
  if (!context) throw new Error("useContextHome deve ser usado dentro de um MyProvider");
  return context;
};
