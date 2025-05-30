import { TheaterProps } from "@/interfaces/theater-interface";
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

    const response = await axios.get(`https://www.adorocinema.com/_/showtimes/movie-${idMovie}/near-${idCity}/d-${data}/`, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0'
      }
    });

    const cinemas : TheaterProps[] = [];
    const results = response.data?.results ?? [];
    const pages = response.data?.pagination.totalPages

    results.forEach((item:any) => {
      const nomeCinema = item.theater?.name ?? "Cinema não identificado";

      const horariosDublados = (item.showtimes?.dubbed ?? []).map((sessao:any) => {
        return new Date(sessao.startsAt).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "America/Sao_Paulo"
        });
      });

      const horariosLegendados = (item.showtimes?.original ?? []).map((sessao:any) => {
        return new Date(sessao.startsAt).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "America/Sao_Paulo"
        });
      });

      cinemas.push({
        cinema: nomeCinema,
        dublados: horariosDublados,
        legendados: horariosLegendados
      });
    });

    for(let i = 2; i<= pages; i++){
      const response = await axios.get(`https://www.adorocinema.com/_/showtimes/movie-${idMovie}/near-${idCity}/d-${data}/?page=${i}`, {
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'User-Agent': 'Mozilla/5.0'
        }
      });

      const results = response.data?.results ?? [];

      results.forEach((item:any) => {
        const nomeCinema = item.theater?.name ?? "Cinema não identificado";
  
        const horariosDublados = (item.showtimes?.dubbed ?? []).map((sessao:any) => {
          return new Date(sessao.startsAt).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "America/Sao_Paulo"
          });
        });
  
        const horariosLegendados = (item.showtimes?.original ?? []).map((sessao:any) => {
          return new Date(sessao.startsAt).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "America/Sao_Paulo"
          });
        });
  
        cinemas.push({
          cinema: nomeCinema,
          dublados: horariosDublados,
          legendados: horariosLegendados
        });
      });
    }

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


export async function getProviderLink(id: string | undefined | null | string[]) {
  try {
    const code = await axios.get("https://server-find-to-watch.vercel.app/api/get-url", {
      params: {
        code: id
      },
    });

    return code.data

  } catch (error) {
    console.error("Erro ao buscar via backend:", error);
  }
}