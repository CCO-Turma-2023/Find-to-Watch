import axios from "axios";

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
