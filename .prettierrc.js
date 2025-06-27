module.exports = {
  ...require("@ngneers/prettier-config").default,
  overrides: [
    {
      files: "*.html",
      options: {
        parser: "angular",
      },
    },
  ],
};
