import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    include: [
      // Core auth-related tests only
      "src/core/utils/cookie.spec.ts",
      "src/msha/auth/routes/*.spec.ts",
      "src/msha/routes-engine/**/*.spec.ts",
    ],
    exclude: [
      // exclude CLI tests for removed commands
      "src/cli/index.spec.ts",
      "src/core/**/deploy-*.spec.ts",
      "src/core/**/func-core-tools.spec.ts",
      "src/core/**/frameworks/*.spec.ts",
      "src/core/**/cli-config.spec.ts",
      "src/core/**/options.spec.ts",
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
