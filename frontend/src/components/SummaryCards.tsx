import type { Summary } from '../types/promotion';

interface Props {
  summary: Summary | null;
}

export function SummaryCards({ summary }: Props) {
  if (!summary) return null;

  const cards = [
    { label: 'Programadas', value: summary.porEstado.PROGRAMADA },
    { label: 'Activas', value: summary.porEstado.ACTIVA },
    { label: 'Finalizadas', value: summary.porEstado.FINALIZADA },
    { label: 'Vigentes hoy', value: summary.vigentesHoy }
  ];

  return (
    <section className="summary-cards" aria-label="Resumen de promociones">
      {cards.map((c) => (
        <div className="summary-card" key={c.label}>
          <span className="summary-card__value">{c.value}</span>
          <span className="summary-card__label">{c.label}</span>
        </div>
      ))}
    </section>
  );
}
