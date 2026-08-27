import { useState } from 'react';
import type { CreatePromotionInput, DiscountType, Product, PromotionTarget } from '../types/promotion';

interface Props {
  products: Product[];
  categories: string[];
  onCreate: (data: CreatePromotionInput) => Promise<void>;
}

const emptyForm = {
  name: '',
  targetType: 'PRODUCTO' as PromotionTarget,
  productId: '',
  categoryName: '',
  discountType: 'PORCENTAJE' as DiscountType,
  discountValue: '',
  startDate: '',
  endDate: ''
};

export function PromotionForm({ products, categories, onCreate }: Props) {
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.name.trim()) {
      setError('El nombre es obligatorio');
      return;
    }
    if (form.targetType === 'PRODUCTO' && !form.productId) {
      setError('Debe seleccionar un producto');
      return;
    }
    if (form.targetType === 'CATEGORIA' && !form.categoryName) {
      setError('Debe seleccionar una categoría');
      return;
    }
    if (!form.discountValue) {
      setError('El valor del descuento es obligatorio');
      return;
    }

    setSubmitting(true);
    try {
      await onCreate({
        name: form.name.trim(),
        targetType: form.targetType,
        productId: form.targetType === 'PRODUCTO' ? Number(form.productId) : null,
        categoryName: form.targetType === 'CATEGORIA' ? form.categoryName : null,
        discountType: form.discountType,
        discountValue: Number(form.discountValue),
        startDate: form.startDate,
        endDate: form.endDate
      });
      setForm(emptyForm);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear la promoción');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="promotion-form" onSubmit={handleSubmit}>
      <h2>Nueva promoción</h2>

      <label>
        Nombre
        <input
          type="text"
          value={form.name}
          onChange={(e) => update('name', e.target.value)}
          placeholder="Ej: Descuento fin de mes"
        />
      </label>

      <fieldset>
        <legend>Aplica a</legend>
        <label className="inline">
          <input
            type="radio"
            name="targetType"
            checked={form.targetType === 'PRODUCTO'}
            onChange={() => update('targetType', 'PRODUCTO')}
          />
          Producto
        </label>
        <label className="inline">
          <input
            type="radio"
            name="targetType"
            checked={form.targetType === 'CATEGORIA'}
            onChange={() => update('targetType', 'CATEGORIA')}
          />
          Categoría
        </label>
      </fieldset>

      {form.targetType === 'PRODUCTO' ? (
        <label>
          Producto
          <select value={form.productId} onChange={(e) => update('productId', e.target.value)}>
            <option value="">Seleccione un producto</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
      ) : (
        <label>
          Categoría
          <select
            value={form.categoryName}
            onChange={(e) => update('categoryName', e.target.value)}
          >
            <option value="">Seleccione una categoría</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      )}

      <label>
        Tipo de descuento
        <select
          value={form.discountType}
          onChange={(e) => update('discountType', e.target.value as DiscountType)}
        >
          <option value="PORCENTAJE">Porcentaje</option>
          <option value="MONTO_FIJO">Monto fijo</option>
        </select>
      </label>

      <label>
        Valor del descuento
        <input
          type="number"
          min={0}
          step="0.01"
          value={form.discountValue}
          onChange={(e) => update('discountValue', e.target.value)}
        />
      </label>

      <label>
        Fecha de inicio
        <input
          type="date"
          value={form.startDate}
          onChange={(e) => update('startDate', e.target.value)}
        />
      </label>

      <label>
        Fecha de fin
        <input
          type="date"
          value={form.endDate}
          onChange={(e) => update('endDate', e.target.value)}
        />
      </label>

      {error && <p className="form-error" role="alert">{error}</p>}

      <button type="submit" disabled={submitting}>
        {submitting ? 'Guardando...' : 'Crear promoción'}
      </button>
    </form>
  );
}
