import { createSlice } from "@reduxjs/toolkit";

const KEY = "cropozone:wishlist";
const load = () => {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
};
const save = (items) => {
  try { localStorage.setItem(KEY, JSON.stringify(items)); } catch { /* storage unavailable */ }
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: { items: load() },
  reducers: {
    toggleWishlist: (state, { payload: p }) => {
      const i = state.items.findIndex((x) => x._id === p._id);
      if (i >= 0) state.items.splice(i, 1);
      else state.items.unshift({ _id: p._id, name: p.name, price: p.price, discountPrice: p.discountPrice, images: p.images?.slice(0, 2), category: p.category, region: p.region, rating: p.rating, countInStock: p.countInStock });
      save(state.items);
    },
    clearWishlist: (state) => { state.items = []; save([]); },
  },
});

export const { toggleWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
