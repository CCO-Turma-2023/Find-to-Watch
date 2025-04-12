interface Session {
    descricao: string;
    horarios: string[];
  }
  
export interface TheatersSearchProps {
    nome: string;
    sessoes: Session[];
  }