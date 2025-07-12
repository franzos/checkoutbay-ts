import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  ssr: {
    noExternal: ["naive-ui", "vueuc", "date-fns"],
  },
  plugins: [vue()],
});
