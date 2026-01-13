
export type Turno = 'Manhã' | 'Tarde' | 'Noite';
export type DiaSemana = 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sábado';

export interface User {
  id: string;
  name: string;
  username: string;
  role: string;
}

export interface Ocupacao {
  id: string;
  sala: string;
  curso: string;
  turma: string;
  turno: Turno;
  diaSemana: DiaSemana;
  horarioInicio: string; // Formato "HH:mm"
  horarioFim: string;    // Formato "HH:mm"
  dataInicio: string;    // Formato "YYYY-MM-DD"
  dataFim: string;       // Formato "YYYY-MM-DD"
  instrutor: string;
  unidade: string;
}

export interface Conflito {
  sala: string;
  diaSemana: DiaSemana;
  ocupacoesEnvolvidas: Ocupacao[];
  motivo: string;
}

export interface RoomMapData {
  sala: string;
  ocupacoes: Ocupacao[];
}
