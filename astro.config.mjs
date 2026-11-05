import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://pgdesigner.io",
  trailingSlash: "never",
  integrations: [
    mdx(),
    sitemap({ filter: (page) => !/\/(thanks|404)\/?$/.test(page) }),
    icon(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
