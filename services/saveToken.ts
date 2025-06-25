import axios from "axios";

export async function saveToken(token : string) {
  try {
    const code = await axios.get("https://server-find-to-watch.vercel.app/api/salvarTokens", {
      params: {
        token
      },
    });

    return code.data

  } catch (error) {
    console.error("Erro ao buscar via backend:", error);
  }
}