import { View, Text, ScrollView, Pressable, StatusBar } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { getFilmCities, getRegioes, getTheaters } from "@/services/scrap";
import { RegioesProps } from "@/interfaces/regioes-interface";
import { CitiesProps } from "@/interfaces/cities-interface";
import { TheatersSearchProps } from "@/interfaces/theater-interface";
import { Ionicons } from "@expo/vector-icons";
import CalendarSlider from "@/components/Calendar";
import { TheaterProps } from "@/interfaces/theater-interface";

export default function Section() {
  const { id } = useLocalSearchParams();
  

  const [regioes, setRegioes] = useState<RegioesProps[]>([]);
  const [openRegiao, setOpenRegiao] = useState(false);
  const [valueRegiao, setValueRegiao] = useState<string | null>(null);

  const [cidades, setCidades] = useState<CitiesProps[]>([]);
  const [openCidade, setOpenCidade] = useState(false);
  const [valueCidade, setValueCidade] = useState<string | null>(null);
  const [cidadeSelecionada, setCidadeSelecionada] = useState<string | null>(
    null,
  );
  const [Theaters, setTheaters] = useState<TheatersSearchProps[]>([]);
  const [data, setData] = useState("")

  function Descricao(desc: string, dataSelecionada: string): string {
    const partesData = dataSelecionada.split("-"); // formato "YYYY-MM-DD"
    const ano = partesData[0];
    const mesIndex = parseInt(partesData[1], 10) - 1;
    const dia = partesData[2];
  
    const meses = [
      "janeiro", "fevereiro", "março", "abril", "maio", "junho",
      "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"
    ];
  
    const mes = meses[mesIndex];
  
    const novaData = `${parseInt(dia)} de ${mes} de ${ano}`;
    const partes = desc.split(" - ");
    const tipo = partes[1] ?? "";
  
    return `${novaData} - ${tipo}`;
  }

  useEffect(() => {
    if (!data) return; // Espera até que a data esteja definida
  
    const fetchTheaters = async () => {
      if (!valueCidade) return; // Certifique-se de que a cidade está selecionada
  
      let idCity = null;
  
      for (let i in cidades) {
        if (cidades[i].value == valueCidade) {
          idCity = cidades[i].id;
          break;
        }
      }
  
      const response = await getTheaters(id, String(idCity), data);

      let cinemas = response ?? [];

      const theaters: Array<TheatersSearchProps> = [];

      if (Array.isArray(cinemas)) {

        const nomesCinemas = cinemas.map((c: TheaterProps) => c.cinema);

        nomesCinemas.forEach((nome) => {
          const horarioCinema = cinemas.find((h: TheaterProps) => h.cinema === nome);

          const sessoes = [];

          if (horarioCinema) {
            if (horarioCinema.dublados?.length) {
              sessoes.push({
                descricao: Descricao("13 de abril de 2025 - Dublado", data),
                horarios: horarioCinema.dublados,
              });
            }
            if (horarioCinema.legendados?.length) {
              sessoes.push({
                descricao: Descricao("13 de abril de 2025 - Versão Original/Legendado", data),
                horarios: horarioCinema.legendados,
              });
            }
          }

          theaters.push({
            nome,
            sessoes,
          });
        });
      }

      setTheaters(theaters);
    };
  
    fetchTheaters();
  }, [valueCidade, data]);
  

  useEffect(() => {
    const fetchRegioes = async () => {
      const response = await getRegioes(id);
      setRegioes(response.filter((r: RegioesProps) => r.ativo));
    };
    fetchRegioes();
  }, []);

  useEffect(() => {
    const fetchCidades = async () => {
      if (!valueRegiao || !id) return;
      setValueCidade(null);
      setCidadeSelecionada(null);

      try {
        const response = await getFilmCities(String(id), valueRegiao);
        setCidades(response);
      } catch (error) {
        console.error("Erro ao buscar cidades:", error);
      }
    };

    fetchCidades();
  }, [valueRegiao]);

  return (
    <View className="flex-1 bg-black p-6">
      <StatusBar backgroundColor="black" translucent={false} />
      <Pressable className=" flex justify-center items-center bg-gray-800 rounded-full w-[50px] h-[50px]"  onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={30} color="#ffffff" />
      </Pressable>
      <Text className="mb-4 text-lg text-white">Selecione uma região:</Text>

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
        style={{ backgroundColor: "#1f2937", borderColor: "#374151" }}
        dropDownContainerStyle={{ backgroundColor: "#1f2937" }}
        textStyle={{ color: "white" }}
        placeholderStyle={{ color: "#9ca3af" }}
        zIndex={3000}
        zIndexInverse={1000}
      />

      {valueRegiao && cidades.length > 0 && (
        <>
          <Text className="mb-2 mt-6 text-lg text-white">
            Selecione uma cidade:
          </Text>
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
            style={{ backgroundColor: "#1f2937", borderColor: "#374151" }}
            dropDownContainerStyle={{ backgroundColor: "#1f2937" }}
            textStyle={{ color: "white" }}
            placeholderStyle={{ color: "#9ca3af" }}
            zIndex={2000}
            zIndexInverse={2000}
          />
        </>
      )}

      {cidadeSelecionada && (
        <>
        <View className="w-full h-50">
          <CalendarSlider onDateChange={setData}/>
        </View>
        <ScrollView className="mt-4" showsVerticalScrollIndicator={true}>
          {Theaters && Array.isArray(Theaters) && (
            <View className="space-y-6 gap-2">
              {Theaters.map((cinema: TheatersSearchProps, index: number) => (
                <View key={index} className="rounded-lg bg-gray-800 p-4">
                  <Text className="mb-2 text-xl font-bold text-white">
                    {cinema.nome}
                  </Text>
                  {cinema.sessoes.map(
                    (
                      sessao: { descricao: string; horarios: string[] },
                      idx: number,
                    ) => (
                      <View key={idx} className="mb-2">
                        <Text className="italic text-gray-300">
                          {sessao.descricao}
                        </Text>
                        <View className="mt-1 flex-row flex-wrap gap-2">
                          {sessao.horarios.map((horario: string, i: number) => (
                            <Text
                              key={i}
                              className="mb-2 mr-2 rounded-md bg-gray-700 px-2 py-1 text-sm text-white"
                            >
                              {horario}
                            </Text>
                          ))}
                        </View>
                      </View>
                    ),
                  )}
                </View>
              ))}
            </View>
          )}
        </ScrollView>
        </>
      )}
    </View>
  );
}
