import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { plugin as markdown, Mode } from "vite-plugin-markdown";
import { PrivateRepoPlugin } from "./vite-plugins/articleFetcher";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    PrivateRepoPlugin(),
    react(),
    markdown({ mode: [Mode.HTML, Mode.REACT] }),
  ],
});
