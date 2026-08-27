import type { Promotion } from '../types/promotion';
import {
  STATUS_LABELS,
  DISCOUNT_TYPE_LABELS,
  formatDiscount,
  formatDate,
  nextStatus
} from '../utils/promotionHelpers';

interface Props {
  promotions: Promotion[];
  onAdvanceStatus: (promotion: Promotion) => void;
  onDelete: (promotion: Promotion) => void;
}

export function PromotionsTable({ promotions, onAdvanceStatus, onDelete }: Props) {
  if (promotions.length === 0) {
    return <p className="empty-state">Aún no hay promociones registradas.</p>;
  }

  return (
    <table className="promotions-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Aplica a</th>
          <th>Descuento</th>
          <th>Vigencia</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {promotions.map((promo) => {
          const next = nextStatus(promo.status);
          const target =
            promo.targetType === 'PRODUCTO'
              ? promo.product?.name ?? 'Producto eliminado'
              : `Categoría: ${promo.categoryName}`;

          return (
            <tr key={promo.id}>
              <td>{promo.name}</td>
              <td>{target}</td>
              <td>{formatDiscount(promo.discountType, promo.discountValue)} ({DISCOUNT_TYPE_LABELS[promo.discountType]})</td>
              <td>{formatDate(promo.startDate)} — {formatDate(promo.endDate)}</td>
              <td>
                <span className={`status-badge status-badge--${promo.status.toLowerCase()}`}>
                  {STATUS_LABELS[promo.status]}
                </span>
              </td>
              <td className="actions">
                {next && (
                  <button type="button" onClick={() => onAdvanceStatus(promo)}>
                    Marcar como {STATUS_LABELS[next]}
                  </button>
                )}
                {promo.status === 'PROGRAMADA' && (
                  <button type="button" className="danger" onClick={() => onDelete(promo)}>
                    Eliminar
                  </button>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
