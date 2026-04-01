import { Link } from 'react-router-dom';
import { PlusCircle, CheckCircle } from 'lucide-react';
import { Stars } from './UI';
import { avgRating } from '../data/fridges';
import s from './FridgeCard.module.css';

export default function FridgeCard({ fridge, onCompare, inCompare }) {
  const avg = avgRating(fridge);

  return (
    <div className={`${s.card} ${fridge.featured ? s.featured : ''}`}>
      {fridge.featured && <div className={s.featuredBadge}>Editor's pick</div>}

      <Link to={`/fridge/${fridge.id}`} className={s.imgWrap}>
        <span className={s.emoji}>{fridge.emoji}</span>
        <div className={s.energyBadge}>{fridge.energy}</div>
      </Link>

      <div className={s.body}>
        <div className={s.brand}>{fridge.brand}</div>
        <Link to={`/fridge/${fridge.id}`} className={s.model}>{fridge.model}</Link>

        <div className={s.ratingRow}>
          <Stars score={avg} />
          <span className={s.score}>{avg}</span>
          <span className={s.reviewCount}>({fridge.reviews.length})</span>
        </div>

        <div className={s.tags}>
          {fridge.tags.slice(0, 2).map(t => (
            <span key={t} className={s.tag}>{t}</span>
          ))}
        </div>

        <div className={s.footer}>
          <div>
            <div className={s.price}>£{fridge.price.toLocaleString()}</div>
            <div className={s.type}>{fridge.type} · {fridge.capacity}L</div>
          </div>
          <button
            className={`${s.compareBtn} ${inCompare ? s.added : ''}`}
            onClick={() => onCompare(fridge)}
            title={inCompare ? 'Remove from compare' : 'Add to compare'}
          >
            {inCompare ? <CheckCircle size={16} /> : <PlusCircle size={16} />}
            {inCompare ? 'Added' : 'Compare'}
          </button>
        </div>
      </div>
    </div>
  );
}
