import { describe, it, expect } from 'vitest';
import { formatDiscount, nextStatus } from './promotionHelpers';

describe('formatDiscount', () => {
  it('formatea porcentaje con símbolo %', () => {
    expect(formatDiscount('PORCENTAJE', 20)).toBe('20%');
  });

  it('formatea monto fijo con separador de miles', () => {
    expect(formatDiscount('MONTO_FIJO', 5000)).toBe('$5.000');
  });
});

describe('nextStatus', () => {
  it('Programada -> Activa', () => {
    expect(nextStatus('PROGRAMADA')).toBe('ACTIVA');
  });

  it('Activa -> Finalizada', () => {
    expect(nextStatus('ACTIVA')).toBe('FINALIZADA');
  });

  it('Finalizada no tiene siguiente estado', () => {
    expect(nextStatus('FINALIZADA')).toBeNull();
  });
});
