import { describe, it, expect } from 'vitest';
import { isTransitionAllowed, isVigenteHoy } from '../src/utils/statusTransitions';

describe('isTransitionAllowed', () => {
  it('permite Programada -> Activa', () => {
    expect(isTransitionAllowed('PROGRAMADA', 'ACTIVA')).toBe(true);
  });

  it('permite Activa -> Finalizada', () => {
    expect(isTransitionAllowed('ACTIVA', 'FINALIZADA')).toBe(true);
  });

  it('no permite saltar de Programada a Finalizada', () => {
    expect(isTransitionAllowed('PROGRAMADA', 'FINALIZADA')).toBe(false);
  });

  it('no permite retroceder de Activa a Programada', () => {
    expect(isTransitionAllowed('ACTIVA', 'PROGRAMADA')).toBe(false);
  });

  it('no permite ningún cambio desde Finalizada', () => {
    expect(isTransitionAllowed('FINALIZADA', 'ACTIVA')).toBe(false);
  });

  it('no permite transición al mismo estado', () => {
    expect(isTransitionAllowed('ACTIVA', 'ACTIVA')).toBe(false);
  });
});

describe('isVigenteHoy', () => {
  it('es verdadero cuando hoy está dentro del rango', () => {
    const today = new Date('2026-08-27T12:00:00');
    expect(isVigenteHoy(new Date('2026-08-01'), new Date('2026-08-31'), today)).toBe(true);
  });

  it('es falso cuando hoy es anterior al inicio', () => {
    const today = new Date('2026-08-01T12:00:00');
    expect(isVigenteHoy(new Date('2026-08-27'), new Date('2026-09-01'), today)).toBe(false);
  });

  it('es falso cuando hoy es posterior al fin', () => {
    const today = new Date('2026-09-05T12:00:00');
    expect(isVigenteHoy(new Date('2026-08-01'), new Date('2026-08-31'), today)).toBe(false);
  });

  it('incluye el día de fin como vigente', () => {
    const today = new Date('2026-08-31T23:00:00');
    expect(isVigenteHoy(new Date('2026-08-01'), new Date('2026-08-31'), today)).toBe(true);
  });
});
