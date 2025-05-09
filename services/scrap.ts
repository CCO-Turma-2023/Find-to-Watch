import axios from "axios";

export async function getFilmId(title: string | undefined) {
  try {
    const code = await axios.get("https://server-find-to-watch.vercel.app/api/get-html", {
      params: {
        search: title
      },
    });

    return code.data

  } catch (error) {
    console.error("Erro ao buscar via backend:", error);
  }
}

export async function getFilmCities(code:string | string[], geocode: string | string[]) {
  try {
    const response = await axios.get("https://server-find-to-watch.vercel.app/api/get-cities", {
      params: {
        search: code, geocode
      },
    });

    return response.data

  } catch (error) {
    console.error("Erro ao buscar via backend:", error);
  }
}

export async function getRegioes(code:string | string[]) {
  try {
    const response = await axios.get("https://server-find-to-watch.vercel.app/api/get-regioes", {
      params: {
        search: code,
      },
    });

    return response.data

  } catch (error) {
    console.error("Erro ao buscar via backend:", error);
  }
}

export async function getTheaters (idMovie : string | string[], idCity : string | string[], data : string) {

  try {
    const response = await axios.get("https://server-find-to-watch.vercel.app/api/get-theaters", {
      params: {
        idMovie,
        idCity, 
        data
      },
    });

    const cinemas = response.data

    const addHours = (time: string, hoursToAdd: number): string => {
      const [hourStr, minuteStr] = time.split(':');
      const hour = parseInt(hourStr, 10);
      const minute = parseInt(minuteStr, 10);

      const date = new Date();
      date.setHours(hour, minute, 0, 0);
      date.setTime(date.getTime() + hoursToAdd * 60 * 60 * 1000);

      const newHour = String(date.getHours()).padStart(2, '0');
      const newMinute = String(date.getMinutes()).padStart(2, '0');
      return `${newHour}:${newMinute}`;
    };

    if (Array.isArray(cinemas)) {
      cinemas.forEach((item: any) => {
        if (Array.isArray(item.dublados)) {
          item.dublados = item.dublados.map((hora: string) => addHours(hora, 3));
        }
        if (Array.isArray(item.legendados)) {
          item.legendados = item.legendados.map((hora: string) => addHours(hora, 3));
        }
      });
    }

    return cinemas;

  } catch (error) {
    console.error("Erro ao buscar via backend:", error);
  }
}

export async function getTheaterInfo(title: string | undefined | null) {
  try {
    const code = await axios.get("https://server-find-to-watch.vercel.app/api/get-theaters-info", {
      params: {
        search: title
      },
    });

    return code.data

  } catch (error) {
    console.error("Erro ao buscar via backend:", error);
  }
}