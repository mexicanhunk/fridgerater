import { useState, useEffect, useCallback } from 'react';
import { Search, X, Loader } from 'lucide-react';
import FridgeCard from '../components/FridgeCard';
import { api } from '../lib/api';
import { fridges as staticFridges, types, brands, priceRanges, avgRating } from '../data/fridges';
import s from './Browse.module.css';

const sortOptions = [
  { label: 'Top rated',     value: 'rating' },
  { label: 'Most reviewed', value: 'reviews' },
  { label: 'Price: low–high', value: 'price_asc' },
  { label: 'Price: high–low', value: 'price_desc' },
  { label: 'Quietest',      value: 'noise' },
];

const PRICE_PARAMS = [
  {},
  { maxPrice: 800 },
  { minPrice: 800, maxPrice: 1200 },
  { minPrice: 1200 },
];

function normaliseApiItem(f) {
  return {
    ...f,
    ratings: {
      noise:       f.avg_noise       ?? 4.0,
      efficiency:  f.avg_efficiency  ?? 4.0,
      storage:     f.avg_storage     ?? 4.0,
      reliability: f.avg_reliability ?? 4.0,
      value:       f.avg_value       ?? 4.0,
    },
    reviews:   Array.from({ length: Number(f.review_count) || 0 }),
    price:     f.price_gbp,
    capacity:  f.capacity_l,
    energy:    f.energy_class,
    noise:     f.noise_db,
    type:      f.type,
  };
}

export default function Browse({ compareList, onCompare }) {
  const [query,       setQuery]       = useState('');
  const [typeFilter,  setTypeFilter]  = useState('All');
  const [brandFilter, setBrandFilter] = useState('All');
  const [priceFilter, setPriceFilter] = useState(0);
  const [sortIdx,     setSortIdx]     = useState(0);

  const [items,    setItems]    = useState([]);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [pages,    setPages]    = useState(1);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [useStatic, setUseStatic] = useState(false);

  const load = useCallback(async (pg = 1) => {
    setLoading(true);
    setError('');
    try {
      const params = {
        search:    query || undefined,
        type:      typeFilter !== 'All' ? typeFilter : undefined,
        brand:     brandFilter !== 'All' ? brandFilter : undefined,
        sort:      sortOptions[sortIdx].value,
        page:      pg,
        limit:     12,
        ...PRICE_PARAMS[priceFilter],
      };
      const data = await api.getFridges(params);
      setItems(data.fridges.map(normaliseApiItem));
      setTotal(data.pagination.total);
      setPages(data.pagination.pages);
      setPage(pg);
      setUseStatic(false);
    } catch {
      // Fall back to static data when backend is not running
      setUseStatic(true);
      const pr = priceRanges[priceFilter];
      const q = query.toLowerCase();
      const filtered = staticFridges
        .filter(f => {
          const matchQ = !q || f.brand.toLowerCase().includes(q) || f.model.toLowerCase().includes(q);
          const matchT = typeFilter === 'All' || f.type === typeFilter;
          const matchB = brandFilter === 'All' || f.brand === brandFilter;
          const matchP = f.price >= pr.min && f.price < pr.max;
          return matchQ && matchT && matchB && matchP;
        })
        .sort((a, b) => {
          if (sortIdx === 0) return avgRating(b) - avgRating(a);
          if (sortIdx === 1) return b.reviews.length - a.reviews.length;
          if (sortIdx === 2) return a.price - b.price;
          if (sortIdx === 3) return b.price - a.price;
          return a.noise - b.noise;
        });
      setItems(filtered);
      setTotal(filtered.length);
      setPages(1);
      setPage(1);
    } finally {
      setLoading(false);
    }
  }, [query, typeFilter, brandFilter, priceFilter, sortIdx]);

  useEffect(() => { load(1); }, [load]);

  function clearFilters() {
    setQuery(''); setTypeFilter('All'); setBrandFilter('All'); setPriceFilter(0); setSortIdx(0);
  }

  const hasFilters = typeFilter !== 'All' || brandFilter !== 'All' || priceFilter !== 0 || query;

  return (
    <div className={s.page}>
      <div className={s.hero}>
        <h1 className={s.heroTitle}>Find your<br />perfect <em>fridge</em></h1>
        <p className={s.heroSub}>Real ratings from real people — no sponsored reviews, no fluff.</p>
        {useStatic && (
          <div className={s.offlineBanner}>
            ⚡ Showing demo data — connect your backend to see live ratings.
          </div>
        )}
        <div className={s.searchWrap}>
          <Search size={16} className={s.searchIcon} />
          <input
            className={s.searchInput}
            placeholder="Search brand, model, or type…"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && <button className={s.clearSearch} onClick={() => setQuery('')}><X size={14} /></button>}
        </div>
      </div>

      <div className={s.controls}>
        <div className={s.stats}>
          {loading ? <Loader size={14} className={s.spin} /> : <strong>{total}</strong>}
          {!loading && ' fridges'}
          {hasFilters && !loading && (
            <button className={s.clearAll} onClick={clearFilters}><X size={12} /> Clear filters</button>
          )}
        </div>
        <div className={s.filterRow}>
          <select className={s.select} value={typeFilter}  onChange={e => setTypeFilter(e.target.value)}>
            {types.map(t => <option key={t}>{t}</option>)}
          </select>
          <select className={s.select} value={brandFilter} onChange={e => setBrandFilter(e.target.value)}>
            {brands.map(b => <option key={b}>{b}</option>)}
          </select>
          <select className={s.select} value={priceFilter} onChange={e => setPriceFilter(Number(e.target.value))}>
            {priceRanges.map((p, i) => <option key={i} value={i}>{p.label}</option>)}
          </select>
          <select className={s.select} value={sortIdx} onChange={e => setSortIdx(Number(e.target.value))}>
            {sortOptions.map((o, i) => <option key={i} value={i}>{o.label}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className={s.loadingGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={s.skeleton} style={{ animationDelay: `${i * 0.05}s` }} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className={s.empty}>
          <span style={{ fontSize: 48 }}>🔍</span>
          <p>No fridges match your filters.</p>
          <button className={s.clearAll} onClick={clearFilters}>Clear all filters</button>
        </div>
      ) : (
        <>
          <div className={s.grid}>
            {items.map((f, i) => (
              <div key={f.id} style={{ animation: `fadeUp 0.35s ease ${i * 0.04}s both` }}>
                <FridgeCard
                  fridge={f}
                  onCompare={onCompare}
                  inCompare={compareList.some(c => c.id === f.id)}
                />
              </div>
            ))}
          </div>

          {pages > 1 && (
            <div className={s.pagination}>
              <button
                className={s.pageBtn}
                disabled={page === 1}
                onClick={() => load(page - 1)}
              >← Prev</button>
              <span className={s.pageInfo}>Page {page} of {pages}</span>
              <button
                className={s.pageBtn}
                disabled={page === pages}
                onClick={() => load(page + 1)}
              >Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
