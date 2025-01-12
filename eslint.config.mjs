import json from "@eslint/json";

export default [
  {
    plugins: {
      json,
    },
  },

  // lint JSON files
  {
    files: ["routes/**/*.json"],
    language: "json/json",
    rules: {
      "json/no-duplicate-keys": "error",
    },
  },
];
