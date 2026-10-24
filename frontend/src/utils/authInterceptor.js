import axios from "axios";
import store from "../redux/store";
import { logout } from "../redux/slices/authSlice";

let installed = false;

// If the server rejects a saved token (expired or signed with a different secret),
// log the user out so the app sends them to /login instead of failing on every request.
export const installAuthInterceptor = () => {
  if (installed) return;
  installed = true;

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      const message = error.response?.data?.message || "";
      if (
        error.response?.status === 401 &&
        message.startsWith("Not authorized") &&
        store.getState().auth.user
      ) {
        store.dispatch(logout());
      }
      return Promise.reject(error);
    }
  );
};
