export const imgUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http") || path.startsWith("data:") || path.startsWith("/")) return path;
  return `${import.meta.env.VITE_BACKEND_URL || "http://localhost:9000"}/${path}`;
};
