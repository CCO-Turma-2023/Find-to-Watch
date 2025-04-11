import { View, Text } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { getFilmCities, getRegioes } from '@/services/scrap';
import { RegioesProps } from '@/interfaces/regioes-interface';
import { CitiesProps } from '@/interfaces/cities-interface';

export default function Section() {
  const { id } = useLocalSearchParams();

  const [regioes, setRegioes] = useState<RegioesProps[]>([]);
  const [openRegiao, setOpenRegiao] = useState(false);
  const [valueRegiao, setValueRegiao] = useState<string | null>(null);

  const [cidades, setCidades] = useState<CitiesProps[]>([]);
  const [openCidade, setOpenCidade] = useState(false);
  const [valueCidade, setValueCidade] = useState<string | null>(null);
  const [cidadeSelecionada, setCidadeSelecionada] = useState<string | null>(null);

  useEffect(() => {
    const fetchRegioes = async () => {
      const response = await getRegioes(id);
      setRegioes(response.filter((r: RegioesProps) => r.ativo));
    };
    fetchRegioes();
  }, [id]);

  useEffect(() => {
    const fetchCidades = async () => {
      if (!valueRegiao || !id) return;
      setValueCidade(null);
      setCidadeSelecionada(null);

      try {
        const response = await getFilmCities(String(id), valueRegiao);
        setCidades(response);
      } catch (error) {
        console.error('Erro ao buscar cidades:', error);
      }
    };

    fetchCidades();
  }, [valueRegiao, id]);

  return (
    <View className="flex-1 bg-black p-4">
      <Text className="text-white text-lg mb-4">Selecione uma região:</Text>

      <DropDownPicker
        open={openRegiao}
        setOpen={setOpenRegiao}
        value={valueRegiao}
        setValue={setValueRegiao}
        items={regioes.map((regiao) => ({
          label: regiao.nome,
          value: regiao.geocode, 
        }))}
        placeholder="Escolha uma região"
        style={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
        dropDownContainerStyle={{ backgroundColor: '#1f2937' }}
        textStyle={{ color: 'white' }}
        placeholderStyle={{ color: '#9ca3af' }}
        zIndex={3000}
        zIndexInverse={1000}
      />

      {valueRegiao && cidades.length > 0 && (
        <>
          <Text className="text-white text-lg mt-6 mb-2">Selecione uma cidade:</Text>
          <DropDownPicker
            open={openCidade}
            setOpen={setOpenCidade}
            value={valueCidade}
            setValue={(val) => {
              setValueCidade(val);
              setCidadeSelecionada(val);
            }}
            items={cidades.map((cidade) => ({
              label: cidade.value,
              value: cidade.value,
            }))}
            placeholder="Escolha uma cidade"
            style={{ backgroundColor: '#1f2937', borderColor: '#374151' }}
            dropDownContainerStyle={{ backgroundColor: '#1f2937' }}
            textStyle={{ color: 'white' }}
            placeholderStyle={{ color: '#9ca3af' }}
            zIndex={2000}
            zIndexInverse={2000}
          />
        </>
      )}

      {cidadeSelecionada && (
        <Text className="text-white mt-4 text-center">
          Cidade selecionada: {cidadeSelecionada}
        </Text>
      )}
    </View>
  );
}
