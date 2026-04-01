import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { types, brands } from '../data/fridges';
import s from './Submit.module.css';

export default function Submit() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    brand: '', model: '', type: '', capacity: '', energy: '', price: '', noise: '', notes: '',
  });

  function handle(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  }

  if (submitted) {
    return (
      <div className={s.success}>
        <div className={s.successIcon}><CheckCircle size={40} color="var(--green-600)" /></div>
        <h2>Thanks for submitting!</h2>
        <p>We'll review your fridge listing and publish it within 24 hours.</p>
        <button className={s.btnAgain} onClick={() => { setSubmitted(false); setForm({ brand:'',model:'',type:'',capacity:'',energy:'',price:'',noise:'',notes:'' }); }}>
          Submit another
        </button>
      </div>
    );
  }

  return (
    <div className={s.page}>
      <div className={s.header}>
        <h1 className={s.title}>Submit a fridge</h1>
        <p className={s.sub}>Can't find a model in our database? Add it so others can review it too.</p>
      </div>

      <form className={s.form} onSubmit={e => { e.preventDefault(); setSubmitted(true); }}>
        <div className={s.section}>
          <div className={s.sectionTitle}>Basic details</div>
          <div className={s.grid2}>
            <div className={s.field}>
              <label>Brand</label>
              <input name="brand" required placeholder="e.g. Samsung" value={form.brand} onChange={handle} />
            </div>
            <div className={s.field}>
              <label>Model name / number</label>
              <input name="model" required placeholder="e.g. Family Hub RF65A977" value={form.model} onChange={handle} />
            </div>
            <div className={s.field}>
              <label>Type</label>
              <select name="type" required value={form.type} onChange={handle}>
                <option value="">Select type…</option>
                {types.filter(t => t !== 'All').map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div className={s.field}>
              <label>Energy rating</label>
              <select name="energy" value={form.energy} onChange={handle}>
                <option value="">Select…</option>
                {['A+++', 'A++', 'A+', 'A', 'B', 'C'].map(e => <option key={e}>{e}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className={s.section}>
          <div className={s.sectionTitle}>Specifications</div>
          <div className={s.grid3}>
            <div className={s.field}>
              <label>Capacity (litres)</label>
              <input name="capacity" type="number" min="50" max="1000" placeholder="e.g. 635" value={form.capacity} onChange={handle} />
            </div>
            <div className={s.field}>
              <label>Price (£)</label>
              <input name="price" type="number" min="0" placeholder="e.g. 1299" value={form.price} onChange={handle} />
            </div>
            <div className={s.field}>
              <label>Noise level (dB)</label>
              <input name="noise" type="number" min="20" max="80" placeholder="e.g. 35" value={form.noise} onChange={handle} />
            </div>
          </div>
        </div>

        <div className={s.section}>
          <div className={s.sectionTitle}>Additional notes</div>
          <div className={s.field}>
            <label>Any other details (optional)</label>
            <textarea name="notes" rows={4} placeholder="Key features, notable pros/cons, where to buy…" value={form.notes} onChange={handle} />
          </div>
        </div>

        <button type="submit" className={s.btnSubmit}>Submit for review →</button>
      </form>
    </div>
  );
}
