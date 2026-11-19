import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// GitHub Pages serves the site from /ChadiTroudi/; Netlify (deploy previews) serves it from /.
// BASE_PATH overrides both, e.g. BASE_PATH=/ for a custom domain.
const base = process.env.BASE_PATH ?? (process.env.NETLIFY ? "/" : "/ChadiTroudi/");

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
