const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testEnvironmentOptions: {
    customExportConditions: [""],
  },
  // Adicionar transformIgnorePatterns para resolver problemas com modules
  transformIgnorePatterns: ["node_modules/(?!(.*\\.mjs$))"],
  // Resolver extensões de arquivo
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
};

module.exports = createJestConfig(customJestConfig);
