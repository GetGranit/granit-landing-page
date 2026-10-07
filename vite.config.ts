import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { ressources } from "./scripts/ressources/vite-plugin";

export default defineConfig({
  vite: {
    plugins: [ressources()],
  },
});
