interface sessoes {
  startsAt: Date;
}

interface SpecificCinema {
  id: string;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  showtimesDubbed: sessoes[];
  showtimesOriginal: sessoes[];
}
