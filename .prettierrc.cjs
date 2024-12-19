// prettier.config.js, .prettierrc.js, prettier.config.cjs, or .prettierrc.cjs

/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  tabWidth: 2,
  useTabs: false,
  printWidth: 200,
  semi: true,
  singleQuote: true,
  trailingComma: "es5",
  // singleAttributePerLine: false,

  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      options: {
        parser: "typescript",
      },
    },
    {
      files: ["*.yml", "*.yaml"],
      options: {
        parser: "yaml",
        printWidth: 500,
      },
    },
    {
      files: "./src/HlstBuilderExecutor.ts",
      options: {
        printWidth: 500,
      },
    },
  ],
};

module.exports = config;
