import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { actualites } from "./scripts/actualites/vite-plugin";
import { ressources } from "./scripts/ressources/vite-plugin";

export default defineConfig({
  vite: {
    plugins: [ressources(), actualites()],
  },
});
