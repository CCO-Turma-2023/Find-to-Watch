// contexts/LocationContext.tsx
import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { TheaterInterface } from '@/interfaces/theater-interface';
import { getTheaterInfo } from '@/services/scrap';

interface LocationContextType {
  region: Region | null;
  theaters: TheaterInterface[] | null;
  subregion: string | null;
  setTheaters: (theaters: TheaterInterface[] | null) => void;
  loadLocationAndTheaters: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [region, setRegion] = useState<Region | null>(null);
  const [theaters, setTheaters] = useState<TheaterInterface[] | null>(null);
  const [subregion, setSubregion] = useState<string | null>(null)

  // Função para carregar localização e cinemas
  const loadLocationAndTheaters = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permissão negada!');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion);

      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      setSubregion(reverseGeocode[0]?.subregion);

      if (reverseGeocode[0]?.subregion) {
        const theatersInfo = await getTheaterInfo(reverseGeocode[0]?.subregion);
        setTheaters(theatersInfo);
      }
    } catch (error) {
      console.error('Erro ao carregar dados de localização e cinemas:', error);
    }
  };

  useEffect(() => {
    if (!region && !theaters) {
      loadLocationAndTheaters();
    }
  }, [region, theaters]);

  return (
    <LocationContext.Provider value={{ region, theaters, subregion, setTheaters, loadLocationAndTheaters }}>
      {children}
    </LocationContext.Provider>
  );
}

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
