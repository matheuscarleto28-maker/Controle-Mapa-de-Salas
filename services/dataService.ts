
import { Ocupacao, Conflito, DiaSemana } from '../types';
import { MOCK_OCUPACAO } from '../constants';

const STORAGE_KEY = 'senac_ocupacoes_uberaba_v1';

/**
 * Obtém a lista completa de ocupações do armazenamento local
 */
export const getOcupacoes = (): Ocupacao[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_OCUPACAO));
    return MOCK_OCUPACAO;
  }
  try {
    const parsed = JSON.parse(data);
    return parsed.filter((o: Ocupacao) => o.unidade === 'Senac Uberaba');
  } catch (e) {
    return MOCK_OCUPACAO;
  }
};

/**
 * Salva uma nova ocupação no armazenamento local
 */
export const saveOcupacao = (entry: Ocupacao): Ocupacao[] => {
  const current = getOcupacoes();
  const updated = [entry, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

/**
 * Sobrescreve toda a base de dados (útil para importação)
 */
export const overwriteOcupacoes = (data: Ocupacao[]): Ocupacao[] => {
  const filtered = data.filter(o => o.unidade === 'Senac Uberaba');
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return filtered;
};

/**
 * Detecta conflitos de horário entre as ocupações
 */
export const getConflitos = (data: Ocupacao[]): Conflito[] => {
  const conflitos: Conflito[] = [];
  const groupedBySalaDia = data.reduce((acc, curr) => {
    const key = `${curr.sala}|${curr.diaSemana}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(curr);
    return acc;
  }, {} as Record<string, Ocupacao[]>);

  Object.entries(groupedBySalaDia).forEach(([key, ocupacoes]) => {
    const [sala, diaSemana] = key.split('|');
    const turnos = ['Manhã', 'Tarde', 'Noite'] as const;
    turnos.forEach(turno => {
      const ocsNoTurno = ocupacoes.filter(o => o.turno === turno);
      if (ocsNoTurno.length > 1) {
        conflitos.push({
          sala,
          diaSemana: diaSemana as DiaSemana,
          ocupacoesEnvolvidas: ocsNoTurno,
          motivo: `Múltiplos cursos no turno da ${turno.toLowerCase()}`
        });
      }
    });
  });
  return conflitos;
};
