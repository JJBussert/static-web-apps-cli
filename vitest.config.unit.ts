import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: [
      // Core auth-related tests only
      "src/core/utils/cookie.spec.ts",
      "src/msha/auth/routes/*.spec.ts",
      "src/msha/routes-engine/**/*.spec.ts",
      // Exclude data-api tests implicitly by not including them
    ],
    mockReset: true,
    restoreMocks: true,
    server: {
      deps: {
        inline: ["to-vfile"],
      },
    },
  },
});
