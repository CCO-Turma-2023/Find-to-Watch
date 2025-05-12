export interface Session {
    descricao: string;
    horarios: string[];
  }

export interface TheaterProps {
    cinema: string;
    dublados: string[];
    legendados: string[];
  }
  
export interface TheatersSearchProps {
    nome: string;
    sessoes: Session[];
  }

 export interface TheaterInterface{
    codigo: string,
    cinema:string,
    endereco: string
}