import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, PlusCircle, ThumbsUp, ThumbsDown, Loader, Star } from 'lucide-react';
import { Stars, Avatar, RatingBar } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import { api } from '../lib/api';
import { fridges as staticFridges, avgRating as staticAvg } from '../data/fridges';
import s from './Detail.module.css';

const LABEL = { noise:'Noise level', efficiency:'Energy efficiency', storage:'Storage & layout', reliability:'Reliability', value:'Value for money' };

function normalise(f) {
  return {
    ...f,
    price:    f.price_gbp    ?? f.price,
    capacity: f.capacity_l   ?? f.capacity,
    energy:   f.energy_class ?? f.energy,
    noise:    f.noise_db     ?? f.noise,
    avgOverall:    Number(f.avg_overall    ?? 0),
    avgNoise:      Number(f.avg_noise      ?? 0),
    avgEfficiency: Number(f.avg_efficiency ?? 0),
    avgStorage:    Number(f.avg_storage    ?? 0),
    avgReliability:Number(f.avg_reliability?? 0),
    avgValue:      Number(f.avg_value      ?? 0),
    reviewCount:   Number(f.review_count   ?? f.reviews?.length ?? 0),
  };
}

export default function Detail({ compareList, onCompare }) {
  const { id } = useParams();
  const { user } = useAuth();

  const [fridge,   setFridge]   = useState(null);
  const [reviews,  setReviews]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [revSort,  setRevSort]  = useState('newest');
  const [showForm, setShowForm] = useState(false);
  const [authModal,setAuthModal]= useState(false);
  const [submitted,setSubmitted]= useState(false);
  const [submitting,setSubmitting]=useState(false);
  const [formErr,  setFormErr]  = useState('');
  const [useStatic,setUseStatic]= useState(false);

  const [form, setForm] = useState({
    title:'', body:'', pros:'', cons:'',
    noise:5, efficiency:5, storage:5, reliability:5, value:5,
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [fridgeData, reviewData] = await Promise.all([
          api.getFridge(id),
          api.getReviews(id, { sort: revSort }),
        ]);
        setFridge(normalise(fridgeData.fridge));
        setReviews(reviewData.reviews);
        setUseStatic(false);
      } catch {
        const sf = staticFridges.find(f => f.id === Number(id));
        if (sf) {
          const avg = staticAvg(sf);
          setFridge({
            ...sf,
            avgOverall: avg,
            avgNoise: sf.ratings.noise, avgEfficiency: sf.ratings.efficiency,
            avgStorage: sf.ratings.storage, avgReliability: sf.ratings.reliability,
            avgValue: sf.ratings.value,
            reviewCount: sf.reviews.length,
          });
          setReviews(sf.reviews.map((r, i) => ({ ...r, id: i, username: r.author })));
          setUseStatic(true);
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, revSort]);

  async function handleVote(reviewId, helpful) {
    if (!user) { setAuthModal(true); return; }
    try { await api.vote(id, reviewId, helpful); } catch {}
  }

  async function handleReviewSubmit(e) {
    e.preventDefault();
    if (!user) { setAuthModal(true); return; }
    setSubmitting(true); setFormErr('');
    try {
      await api.submitReview(id, form);
      setSubmitted(true); setShowForm(false);
      const data = await api.getReviews(id, { sort: revSort });
      setReviews(data.reviews);
    } catch (err) {
      setFormErr(err.message || 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return (
    <div className={s.page}>
      <div className={s.loadingState}><Loader size={24} className={s.spin} /></div>
    </div>
  );

  if (!fridge) return (
    <div className={s.page}>
      <p>Fridge not found. <Link to="/">← Back to browse</Link></p>
    </div>
  );

  const inCompare = compareList.some(c => c.id === fridge.id);
  const ratingDims = [
    { key:'noise',       label: LABEL.noise,       val: fridge.avgNoise },
    { key:'efficiency',  label: LABEL.efficiency,  val: fridge.avgEfficiency },
    { key:'storage',     label: LABEL.storage,     val: fridge.avgStorage },
    { key:'reliability', label: LABEL.reliability, val: fridge.avgReliability },
    { key:'value',       label: LABEL.value,        val: fridge.avgValue },
  ];

  return (
    <div className={s.page}>
      {authModal && <AuthModal onClose={() => setAuthModal(false)} defaultTab="login" />}

      <Link to="/" className={s.back}><ArrowLeft size={14} /> Back to browse</Link>
      {useStatic && <div className={s.offlineBanner}>⚡ Showing demo data — connect your backend for live reviews.</div>}

      <div className={s.header}>
        <div className={s.imgBox}><span className={s.emoji}>{fridge.emoji}</span></div>
        <div className={s.info}>
          <div className={s.brand}>{fridge.brand}</div>
          <h1 className={s.model}>{fridge.model}</h1>

          <div className={s.ratingHeader}>
            <Stars score={fridge.avgOverall} size="md" />
            <span className={s.scoreBig}>{fridge.avgOverall || '—'}</span>
            <span className={s.reviewMeta}>· {fridge.reviewCount} review{fridge.reviewCount !== 1 ? 's' : ''}</span>
          </div>

          <div className={s.pills}>
            {[fridge.type, `${fridge.capacity}L`, fridge.energy, `£${fridge.price?.toLocaleString()}`, `${fridge.noise} dB`].filter(Boolean).map(t => (
              <span key={t} className={s.pill}>{t}</span>
            ))}
          </div>

          <div className={s.ratingBars}>
            {ratingDims.map(d => d.val > 0 && <RatingBar key={d.key} label={d.label} value={d.val} />)}
          </div>

          <div className={s.actions}>
            <button
              className={`${s.btnCompare} ${inCompare ? s.compareAdded : ''}`}
              onClick={() => onCompare(fridge)}
            >
              {inCompare ? <><CheckCircle size={15} /> Added</> : <><PlusCircle size={15} /> Add to compare</>}
            </button>
            <button
              className={s.btnReview}
              onClick={() => user ? setShowForm(v => !v) : setAuthModal(true)}
            >
              Write a review
            </button>
          </div>
        </div>
      </div>

      {submitted && <div className={s.successBanner}>✓ Thanks! Your review has been submitted.</div>}

      {showForm && (
        <form className={s.reviewForm} onSubmit={handleReviewSubmit}>
          <h3 className={s.formTitle}>Write a review</h3>

          <div className={s.starRatings}>
            {['noise','efficiency','storage','reliability','value'].map(dim => (
              <div key={dim} className={s.starRow}>
                <span className={s.starLabel}>{LABEL[dim]}</span>
                <div className={s.starPicker}>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} type="button"
                      className={`${s.starBtn} ${form[dim] >= n ? s.starOn : ''}`}
                      onClick={() => setForm(f => ({ ...f, [dim]: n }))}
                    >★</button>
                  ))}
                </div>
                <span className={s.starVal}>{form[dim]}.0</span>
              </div>
            ))}
          </div>

          <div className={s.formGrid}>
            <div className={s.formField} style={{ gridColumn: '1/-1' }}>
              <label>Review title</label>
              <input required placeholder="Summarise your experience…" value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            </div>
            <div className={s.formField} style={{ gridColumn: '1/-1' }}>
              <label>Your review</label>
              <textarea required rows={4} placeholder="Tell others what you think…" value={form.body}
                onChange={e => setForm(f => ({ ...f, body: e.target.value }))} />
            </div>
            <div className={s.formField}>
              <label>Pros</label>
              <input placeholder="What did you love?" value={form.pros}
                onChange={e => setForm(f => ({ ...f, pros: e.target.value }))} />
            </div>
            <div className={s.formField}>
              <label>Cons</label>
              <input placeholder="What could be better?" value={form.cons}
                onChange={e => setForm(f => ({ ...f, cons: e.target.value }))} />
            </div>
          </div>

          {formErr && <div className={s.formError}>{formErr}</div>}

          <div className={s.formActions}>
            <button type="button" className={s.btnCancel} onClick={() => setShowForm(false)}>Cancel</button>
            <button type="submit" className={s.btnSubmit} disabled={submitting}>
              {submitting ? <Loader size={14} className={s.spin} /> : null}
              {submitting ? 'Submitting…' : 'Submit review'}
            </button>
          </div>
        </form>
      )}

      <div className={s.reviewsSection}>
        <div className={s.reviewsHeader}>
          <h2 className={s.sectionTitle}>Reviews</h2>
          <select className={s.sortSelect} value={revSort} onChange={e => setRevSort(e.target.value)}>
            <option value="newest">Newest first</option>
            <option value="helpful">Most helpful</option>
            <option value="highest">Highest rated</option>
            <option value="lowest">Lowest rated</option>
          </select>
        </div>

        {reviews.length === 0 ? (
          <div className={s.noReviews}>
            <p>No reviews yet. Be the first!</p>
            <button className={s.btnReview} onClick={() => user ? setShowForm(true) : setAuthModal(true)}>
              Write the first review
            </button>
          </div>
        ) : reviews.map((r, i) => (
          <div key={r.id ?? i} className={s.reviewCard}>
            <div className={s.reviewTop}>
              <div className={s.reviewer}>
                <Avatar initials={(r.username || r.author || 'AN').slice(0,2).toUpperCase()} color={['blue','green','amber'][i % 3]} />
                <div>
                  <div className={s.reviewerName}>
                    {r.username || r.author}
                    {r.verified && <span className={s.verified}>✓ Verified</span>}
                  </div>
                  <div className={s.reviewerDate}>
                    {r.date || new Date(r.created_at).toLocaleDateString('en-GB', { month:'long', year:'numeric' })}
                  </div>
                </div>
              </div>
              <Stars score={r.score ?? r.overall ?? 5} size="sm" />
            </div>

            <div className={s.reviewTitle}>{r.title}</div>
            <p className={s.reviewBody}>{r.body}</p>

            {(r.pros || r.cons) && (
              <div className={s.proscons}>
                {r.pros && <div className={s.pros}><div className={s.prosLabel}>PROS</div><p>{r.pros}</p></div>}
                {r.cons && <div className={s.cons}><div className={s.consLabel}>CONS</div><p>{r.cons}</p></div>}
              </div>
            )}

            {!useStatic && (
              <div className={s.reviewActions}>
                <span className={s.helpfulLabel}>Helpful?</span>
                <button className={s.helpfulBtn} onClick={() => handleVote(r.id, true)}>
                  <ThumbsUp size={13} /> {r.helpful_count > 0 ? r.helpful_count : ''}
                </button>
                <button className={s.helpfulBtn} onClick={() => handleVote(r.id, false)}>
                  <ThumbsDown size={13} />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
