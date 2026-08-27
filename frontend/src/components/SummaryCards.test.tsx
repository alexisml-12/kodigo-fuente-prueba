import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SummaryCards } from './SummaryCards';

describe('SummaryCards', () => {
  it('no renderiza nada si no hay resumen', () => {
    const { container } = render(<SummaryCards summary={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('muestra los conteos por estado y vigentes hoy', () => {
    render(
      <SummaryCards
        summary={{
          porEstado: { PROGRAMADA: 2, ACTIVA: 1, FINALIZADA: 3 },
          vigentesHoy: 1
        }}
      />
    );

    expect(screen.getByText('Programadas')).toBeInTheDocument();
    expect(screen.getByText('Activas')).toBeInTheDocument();
    expect(screen.getByText('Finalizadas')).toBeInTheDocument();
    expect(screen.getByText('Vigentes hoy')).toBeInTheDocument();
  });
});
