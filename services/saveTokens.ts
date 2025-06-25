import axios from "axios";

export async function SaveTokens(token : string) {
  try {

    const response = await axios.get(
    "https://server-find-to-watch.vercel.app/api/salvarTokens",
    { params: { token } },
  );

  } catch (error) {
    console.error("Erro ao buscar via backend: Aqui", error);
  }
}