import axios from "axios";
import { find } from "cheerio/dist/commonjs/api/traversing";
import { Buffer } from "buffer";

export default async function handlePress() {
  try {
    const response = await axios.get("http://localhost:3000/get-html", {
      params: {
        search: "Bastardos Inglórios",
      },
    });

    console.log(response.data.link);
  } catch (error) {
    console.error("Erro ao buscar via backend:", error);
  }
}
