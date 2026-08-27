import { useEffect, useState, useCallback } from 'react';
import { promotionsApi, productsApi } from './api/promotions';
import { ApiError } from './api/client';
import type { Promotion, Product, Summary, CreatePromotionInput } from './types/promotion';
import { PromotionForm } from './components/PromotionForm';
import { PromotionsTable } from './components/PromotionsTable';
import { SummaryCards } from './components/SummaryCards';
import './App.css';

export default function App() {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [promos, prods, summ] = await Promise.all([
        promotionsApi.list(),
        productsApi.list(),
        promotionsApi.summary()
      ]);
      setPromotions(promos);
      setProducts(prods);
      setSummary(summ);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const categories = Array.from(new Set(products.map((p) => p.category))).sort();

  async function handleCreate(data: CreatePromotionInput) {
    try {
      await promotionsApi.create(data);
      await loadAll();
    } catch (err) {
      if (err instanceof ApiError) throw new Error(err.message);
      throw err;
    }
  }

  async function handleAdvanceStatus(promo: Promotion) {
    const next = promo.status === 'PROGRAMADA' ? 'ACTIVA' : 'FINALIZADA';
    try {
      await promotionsApi.changeStatus(promo.id, next);
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo cambiar el estado');
    }
  }

  async function handleDelete(promo: Promotion) {
    if (!confirm(`¿Eliminar la promoción "${promo.name}"?`)) return;
    try {
      await promotionsApi.remove(promo.id);
      await loadAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar la promoción');
    }
  }

  return (
    <div className="app">
      <header>
        <h1>Gestión de Promociones</h1>
        <p className="subtitle">Kódigo Fuente · POS</p>
      </header>

      {error && (
        <p className="global-error" role="alert">
          {error}
        </p>
      )}

      <SummaryCards summary={summary} />

      <main className="content">
        <PromotionForm products={products} categories={categories} onCreate={handleCreate} />

        <section>
          <h2>Promociones</h2>
          {loading ? (
            <p>Cargando...</p>
          ) : (
            <PromotionsTable
              promotions={promotions}
              onAdvanceStatus={handleAdvanceStatus}
              onDelete={handleDelete}
            />
          )}
        </section>
      </main>
    </div>
  );
}
