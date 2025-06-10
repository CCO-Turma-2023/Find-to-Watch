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

export async function getSpecificCinema(id: string, date: string) {
  try {
    const response = await axios.get(
      `https://www.adorocinema.com/_/showtimes/theater-${id}/d-${date}/`,
    );

    const len = response.data.results.length;
    if (len === 0) {
      return;
    }
    let result = [];

    for (let i = 0; i < len; i++) {
      const movies = response.data.results[i].movie;
      const showtimes = response.data.results[i].showtimes;
      result[i] = {
        id: movies.id,
        title: movies.title,
        overview: movies.synopsis,
        poster_path: movies.poster.url,
        release_date: movies.data.productionYear,
        showtimesDubbed: showtimes.dubbed,
        showtimesOriginal: showtimes.original,
      };
    }
    return result;
  } catch (error) {
    console.error("Erro ao buscar via backend:", error);
  }
}