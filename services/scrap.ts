import axios from "axios";
import { find } from "cheerio/dist/commonjs/api/traversing";
import { Buffer } from "buffer";

export default async function handlePress() {
  try {
    const response = await axios.get("http://localhost:3000/get-html");

    const htmlString = response.data; // Isso é o HTML como string
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");

    console.log(doc);

    const html = await response.data;
  } catch (error) {
    console.error("Erro ao buscar via backend:", error);
  }
}
