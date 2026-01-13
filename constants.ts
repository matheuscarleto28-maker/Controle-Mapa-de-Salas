
import { Ocupacao, DiaSemana } from './types';

export const DIAS_SEMANA: DiaSemana[] = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
export const TURNOS: ('Manhã' | 'Tarde' | 'Noite')[] = ['Manhã', 'Tarde', 'Noite'];

export const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

// Função auxiliar para gerar salas nas faixas solicitadas: 101-115, 201-215, 301-315
const generateRoomList = () => {
  const ranges = [
    { start: 101, end: 115 },
    { start: 201, end: 215 },
    { start: 301, end: 315 }
  ];
  const rooms: string[] = [];
  ranges.forEach(range => {
    for (let i = range.start; i <= range.end; i++) {
      rooms.push(`Sala ${i}`);
    }
  });
  return rooms;
};

export const MASTER_ROOM_LIST = generateRoomList();

// Banco de dados inicial vazio
export const MOCK_OCUPACAO: Ocupacao[] = [];
