export interface Session {
    descricao: string;
    horarios: string[];
  }

export interface Horarios {
    cinema: string;
    dublados: string[];
    legendados: string[];
  }
  
export interface TheatersSearchProps {
    nome: string;
    sessoes: Session[];
  }