const KEY = "cropozone:recent";
export const getRecent = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
};
export const pushRecent = (p) => {
  if (!p?._id) return;
  const snap = { _id: p._id, name: p.name, price: p.price, images: p.images?.slice(0, 1), category: p.category };
  try {
    const next = [snap, ...getRecent().filter((x) => x._id !== p._id)].slice(0, 8);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch { /* storage unavailable */ }
};
