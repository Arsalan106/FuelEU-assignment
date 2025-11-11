/** @type {import('jest').Config} */
export default {
  testEnvironment: "node",

  transform: {
    "^.+\\.tsx?$": ["ts-jest", { useESM: true }]
  },

  extensionsToTreatAsEsm: [".ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  roots: ["<rootDir>/tests"],

  // ✅ Fix Windows bug & avoid touching node_modules
  moduleNameMapper: {
    // only remap *relative* imports from your src/ or tests/
    "^(\\.{1,2}/[^/].*)\\.js$": "$1.ts"
  },

  // Prevent Jest from scanning node_modules for ESM conflicts
  transformIgnorePatterns: ["node_modules/(?!.*)"]
};
