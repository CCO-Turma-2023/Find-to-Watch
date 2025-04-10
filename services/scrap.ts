import axios from "axios";
import { find } from "cheerio/dist/commonjs/api/traversing";
import { Buffer } from "buffer";

export default async function handlePress() {
  try {
    /*
    const response = await axios.get("http://localhost:3000/get-html", {
      params: {
        search: "Um filme Minecraft",
      },
    });
    */
    const response2 = await axios.get("http://localhost:3000/chama2");
    const teste = JSON.stringify(response2, null, 2)
    
    
    const afterTeste = teste.split('href')[1]; 
    console.log(afterTeste);

    


  } catch (error) {
    console.error("Erro ao buscar via backend:", error);
  }
}
