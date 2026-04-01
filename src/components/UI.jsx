import styles from './Stars.module.css';

export function Stars({ score, size = 'sm' }) {
  return (
    <span className={`${styles.stars} ${styles[size]}`}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} className={score >= i ? styles.filled : score >= i - 0.5 ? styles.half : styles.empty}>★</span>
      ))}
    </span>
  );
}

export function Badge({ children, variant = 'blue' }) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}

export function Avatar({ initials, color = 'blue' }) {
  const colors = {
    blue: { bg: 'var(--ice-50)', color: 'var(--ice-800)' },
    green: { bg: 'var(--green-50)', color: 'var(--green-600)' },
    amber: { bg: 'var(--amber-50)', color: 'var(--amber-800)' },
  };
  return (
    <div style={{
      width: 36, height: 36, borderRadius: '50%',
      background: colors[color].bg, color: colors[color].color,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 13, fontWeight: 600, flexShrink: 0,
    }}>{initials}</div>
  );
}

export function RatingBar({ label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
      <span style={{ fontSize: 13, color: 'var(--text-2)', width: 130, flexShrink: 0 }}>{label}</span>
      <div style={{ flex: 1, height: 6, background: 'var(--surface-2)', borderRadius: 3, overflow: 'hidden' }}>
        <div style={{ width: `${(value / 5) * 100}%`, height: '100%', background: 'var(--ice-400)', borderRadius: 3, transition: 'width 0.6s ease' }} />
      </div>
      <span style={{ fontSize: 13, fontWeight: 500, width: 28, textAlign: 'right' }}>{value}</span>
    </div>
  );
}
