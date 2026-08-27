import type { PromotionStatus } from '../types/promotion';

// Transiciones permitidas: Programada -> Activa -> Finalizada.
// No se permite saltar estados ni retroceder, y Finalizada es un estado terminal.
const ALLOWED_TRANSITIONS: Record<PromotionStatus, PromotionStatus[]> = {
  PROGRAMADA: ['ACTIVA'],
  ACTIVA: ['FINALIZADA'],
  FINALIZADA: []
};

export function isTransitionAllowed(from: PromotionStatus, to: PromotionStatus): boolean {
  if (from === to) return false;
  return ALLOWED_TRANSITIONS[from].includes(to);
}

export function isVigenteHoy(startDate: Date, endDate: Date, today: Date = new Date()): boolean {
  const day = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const start = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  return day >= start && day <= end;
}
