import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    files: ["src/**/*.ts"],
    extends: [tseslint.configs.base],
    rules: {
      curly: "warn",
      eqeqeq: "warn",
      "no-throw-literal": "warn",
      semi: "warn",
    },
  },
);
