export const fridges = [
  {
    id: 1,
    brand: 'Samsung',
    model: 'Family Hub RF65A977',
    type: 'French Door',
    capacity: 635,
    energy: 'A++',
    price: 1299,
    noise: 35,
    emoji: '🧊',
    tags: ['Smart', 'NoFrost', 'Ice Maker'],
    featured: true,
    ratings: { noise: 4.6, efficiency: 4.4, storage: 4.9, reliability: 4.8, value: 4.0 },
    reviews: [
      { id: 1, author: 'James M.', initials: 'JM', color: 'blue', date: 'March 2025', verified: true, score: 5, title: 'Genuinely changed how we use our kitchen', body: 'Three months in and still impressed. The Family Hub screen is actually useful — we use it daily for shopping lists. Absolutely silent at night, which was a big deal for us since the kitchen is open plan.', pros: 'Dead quiet. Huge storage. Smart screen is intuitive.', cons: 'Pricey. Ice maker takes a while to fill up.' },
      { id: 2, author: 'Sophie R.', initials: 'SR', color: 'green', date: 'February 2025', verified: false, score: 4, title: 'Great fridge, slightly fiddly shelves', body: 'Overall very happy. Keeps things consistently cold, and the door-in-door section is great for drinks. Shelf adjustment requires more effort than expected — you need to remove everything first.', pros: 'Consistent temperature. Excellent layout for families.', cons: 'Shelves fiddly to adjust. App setup is clunky.' },
      { id: 3, author: 'Tom K.', initials: 'TK', color: 'amber', date: 'January 2025', verified: true, score: 5, title: 'Worth every penny', body: 'Was hesitant about the price but this fridge is genuinely premium. Build quality feels solid, the screen is responsive, and it keeps our groceries noticeably fresher longer.', pros: 'Premium build. Food stays fresh longer. Looks stunning.', cons: 'Takes up significant space. Delivery was slow.' },
    ],
  },
  {
    id: 2,
    brand: 'LG',
    model: 'InstaView Door-in-Door',
    type: 'Side-by-Side',
    capacity: 601,
    energy: 'A+++',
    price: 999,
    noise: 38,
    emoji: '🔒',
    tags: ['InstaView', 'NoFrost', 'ThinQ'],
    featured: false,
    ratings: { noise: 4.2, efficiency: 4.8, storage: 4.5, reliability: 4.6, value: 4.4 },
    reviews: [
      { id: 1, author: 'Priya S.', initials: 'PS', color: 'blue', date: 'April 2025', verified: true, score: 5, title: 'The knock-to-see-through panel is a game changer', body: 'No more opening the door and losing cold air. The InstaView panel is genuinely smart. Really impressed with build quality for the price.', pros: 'InstaView panel. Excellent energy rating. Great price.', cons: 'Ice dispenser occasionally jams.' },
      { id: 2, author: 'Marcus W.', initials: 'MW', color: 'green', date: 'March 2025', verified: false, score: 4, title: 'Solid performer, nothing flashy', body: 'Does exactly what it says. Quiet, efficient, well laid out. Lacks the wow factor of Samsung but costs £300 less and is arguably more practical.', pros: 'Great value. Very efficient. Quiet.', cons: 'No smart screen. Shelves feel slightly plasticky.' },
    ],
  },
  {
    id: 3,
    brand: 'Miele',
    model: 'KFN 29683 D',
    type: 'French Door',
    capacity: 587,
    energy: 'A++',
    price: 1749,
    noise: 32,
    emoji: '🥶',
    tags: ['PerfectFresh', 'NoFrost', 'DynaCool'],
    featured: false,
    ratings: { noise: 4.9, efficiency: 4.6, storage: 4.7, reliability: 5.0, value: 3.8 },
    reviews: [
      { id: 1, author: 'Helena B.', initials: 'HB', color: 'amber', date: 'February 2025', verified: true, score: 5, title: 'Whisper quiet and impeccably built', body: 'You forget it is even running. Miele quality shows in every detail. The PerfectFresh zone keeps herbs and salad alive for nearly two weeks.', pros: 'Virtually silent. Exceptional build. PerfectFresh is incredible.', cons: 'Expensive. Smaller capacity than competitors at this price.' },
    ],
  },
  {
    id: 4,
    brand: 'Bosch',
    model: 'Serie 8 KGN86AIDR',
    type: 'Freestanding',
    capacity: 559,
    energy: 'A++',
    price: 849,
    noise: 37,
    emoji: '🧺',
    tags: ['VitaFresh', 'NoFrost', 'Home Connect'],
    featured: false,
    ratings: { noise: 4.3, efficiency: 4.5, storage: 4.4, reliability: 4.7, value: 4.5 },
    reviews: [
      { id: 1, author: 'Daniel F.', initials: 'DF', color: 'blue', date: 'March 2025', verified: true, score: 4, title: 'Reliable workhorse', body: 'Second Bosch fridge I have owned. Just works — no drama. VitaFresh keeps food surprisingly fresh. Would recommend to anyone who wants quality without gimmicks.', pros: 'Reliable. VitaFresh is excellent. Sensible price.', cons: 'Plain design. App is basic.' },
    ],
  },
  {
    id: 5,
    brand: 'Haier',
    model: 'Multi-Door HB26FSSAAA',
    type: 'Multi-Door',
    capacity: 708,
    energy: 'A+',
    price: 1099,
    noise: 40,
    emoji: '🫙',
    tags: ['Multi-Door', 'Total No Frost', 'Flexi-Space'],
    featured: false,
    ratings: { noise: 3.8, efficiency: 4.0, storage: 4.8, reliability: 4.2, value: 4.3 },
    reviews: [
      { id: 1, author: 'Yuki T.', initials: 'YT', color: 'green', date: 'January 2025', verified: false, score: 4, title: 'Huge capacity, great price', body: 'If you need volume, this is unbeatable at this price. The Flexi-Space drawer is brilliant for bulky items. Slightly louder than expected but not annoying.', pros: 'Massive capacity. Great layout. Competitive price.', cons: 'Noticeably louder than premium brands. Slightly plasticky shelves.' },
    ],
  },
  {
    id: 6,
    brand: 'AEG',
    model: 'RCB736E5MB',
    type: 'Freestanding',
    capacity: 379,
    energy: 'A++',
    price: 699,
    noise: 39,
    emoji: '❄️',
    tags: ['CustomFlex', 'NoFrost', 'Holiday Mode'],
    featured: false,
    ratings: { noise: 3.9, efficiency: 4.3, storage: 3.8, reliability: 4.1, value: 4.2 },
    reviews: [
      { id: 1, author: 'Claire H.', initials: 'CH', color: 'amber', date: 'February 2025', verified: true, score: 4, title: 'Good mid-range option', body: 'Fits perfectly in our kitchen and does a good job. The CustomFlex drawer is handy. Nothing extraordinary but solid for the price.', pros: 'Compact. Decent price. CustomFlex drawer useful.', cons: 'Smaller capacity. No smart features.' },
    ],
  },
];

export const types = ['All', 'French Door', 'Side-by-Side', 'Freestanding', 'Multi-Door'];
export const brands = ['All', 'Samsung', 'LG', 'Miele', 'Bosch', 'Haier', 'AEG'];
export const priceRanges = [
  { label: 'All prices', min: 0, max: Infinity },
  { label: 'Under £800', min: 0, max: 800 },
  { label: '£800 – £1,200', min: 800, max: 1200 },
  { label: 'Over £1,200', min: 1200, max: Infinity },
];

export function avgRating(fridge) {
  const vals = Object.values(fridge.ratings);
  return +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
}
