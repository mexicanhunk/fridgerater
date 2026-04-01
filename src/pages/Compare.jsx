import { Link } from 'react-router-dom';
import { X, Trophy } from 'lucide-react';
import { Stars } from '../components/UI';
import { fridges, avgRating } from '../data/fridges';
import s from './Compare.module.css';

const attrs = [
  { key: 'price', label: 'Price', fmt: v => `£${v.toLocaleString()}`, best: 'min' },
  { key: 'type', label: 'Type', fmt: v => v },
  { key: 'capacity', label: 'Capacity', fmt: v => `${v}L`, best: 'max' },
  { key: 'energy', label: 'Energy rating', fmt: v => v },
  { key: 'noise', label: 'Noise', fmt: v => `${v} dB`, best: 'min' },
  { key: 'ratings.noise', label: 'Noise rating', fmt: v => v.toFixed(1), best: 'max' },
  { key: 'ratings.efficiency', label: 'Efficiency rating', fmt: v => v.toFixed(1), best: 'max' },
  { key: 'ratings.storage', label: 'Storage rating', fmt: v => v.toFixed(1), best: 'max' },
  { key: 'ratings.reliability', label: 'Reliability', fmt: v => v.toFixed(1), best: 'max' },
  { key: 'ratings.value', label: 'Value for money', fmt: v => v.toFixed(1), best: 'max' },
];

function getVal(fridge, key) {
  if (key.startsWith('ratings.')) return fridge.ratings[key.split('.')[1]];
  return fridge[key];
}

export default function Compare({ compareList, onCompare }) {
  if (compareList.length === 0) {
    return (
      <div className={s.empty}>
        <span style={{ fontSize: 56 }}>📊</span>
        <h2>Nothing to compare yet</h2>
        <p>Add up to 4 fridges from the browse page to compare them side by side.</p>
        <Link to="/" className={s.browseLink}>Browse fridges →</Link>
      </div>
    );
  }

  const scores = compareList.map(avgRating);
  const bestScore = Math.max(...scores);

  return (
    <div className={s.page}>
      <div className={s.topBar}>
        <h1 className={s.title}>Comparing {compareList.length} fridges</h1>
        <Link to="/" className={s.addMore}>+ Add more fridges</Link>
      </div>

      <div className={s.grid} style={{ gridTemplateColumns: `200px repeat(${compareList.length}, 1fr)` }}>
        {/* header row */}
        <div className={s.attrCol} />
        {compareList.map(f => {
          const avg = avgRating(f);
          const isWinner = avg === bestScore;
          return (
            <div key={f.id} className={`${s.fridgeCol} ${isWinner ? s.winner : ''}`}>
              {isWinner && <div className={s.winnerBadge}><Trophy size={11} /> Best overall</div>}
              <button className={s.removeBtn} onClick={() => onCompare(f)} title="Remove"><X size={14} /></button>
              <div className={s.colEmoji}>{f.emoji}</div>
              <div className={s.colBrand}>{f.brand}</div>
              <Link to={`/fridge/${f.id}`} className={s.colModel}>{f.model}</Link>
              <Stars score={avg} size="sm" />
              <div className={s.colScore}>{avg}</div>
            </div>
          );
        })}

        {/* attribute rows */}
        {attrs.map(attr => {
          const vals = compareList.map(f => getVal(f, attr.key));
          const numVals = vals.filter(v => typeof v === 'number');
          const bestVal = attr.best === 'max' ? Math.max(...numVals) : Math.min(...numVals);

          return [
            <div key={`label-${attr.key}`} className={s.attrLabel}>{attr.label}</div>,
            ...compareList.map((f, i) => {
              const val = vals[i];
              const isBest = typeof val === 'number' && val === bestVal && numVals.length > 1;
              return (
                <div key={`${f.id}-${attr.key}`} className={`${s.attrCell} ${isBest ? s.bestCell : ''}`}>
                  {attr.fmt(val)}
                  {isBest && <span className={s.bestDot} />}
                </div>
              );
            })
          ];
        })}
      </div>
    </div>
  );
}
