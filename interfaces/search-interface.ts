export interface MovieSearchProps {
  id: string;
  title: string;
  name: string;
  overview: string;
  poster_path: string;
  key: string | undefined
  movie: boolean;
  release_date: string
}

export interface contentProvider {
  display_priority: string,
  logo_path: string,
  provider_name: string,
  provider_id: string
}

export interface providerLink {
  title: string,
  link: string
}