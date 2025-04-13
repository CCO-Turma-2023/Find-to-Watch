// components/CalendarSlider.tsx
import { Text, ScrollView, Pressable } from "react-native";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
dayjs.locale("pt-br");

const diasSemana = ["DOM.", "SEG.", "TER.", "QUA.", "QUI.", "SEX.", "SÁB."];

type CalendarSliderProps = {
  onDateChange?: (date: string) => void;
};

export default function CalendarSlider({ onDateChange }: CalendarSliderProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const gerarSemana = () => {
    const hoje = dayjs();
    return Array.from({ length: 30 }, (_, i) => hoje.add(i, "day"));
  };

  const semana = gerarSemana();

  useEffect(() => {
    const selectedDate = semana[selectedIndex].format("YYYY-MM-DD");
    onDateChange?.(selectedDate);
  }, [selectedIndex]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mt-4 flex-row rounded-xl bg-gray-200 p-2"
    >
      {semana.map((dia, index) => {
        const isSelected = index === selectedIndex;
        return (
          <Pressable
            key={index}
            onPress={() => setSelectedIndex(index)}
            className={`mx-1 w-16 items-center justify-center rounded-xl p-2 ${
              isSelected ? "bg-black" : "bg-white"
            }`}
          >
            <Text className={`text-xs font-bold ${isSelected ? "text-white" : "text-gray-500"}`}>
              {diasSemana[dia.day()]}
            </Text>
            <Text className={`text-xl font-bold ${isSelected ? "text-white" : "text-black"}`}>
              {dia.format("DD")}
            </Text>
            <Text className={`text-xs font-semibold ${isSelected ? "text-white" : "text-gray-500"}`}>
              {dia.format("MMM").toUpperCase()}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
