module.exports = {
  ...require("@ngneers/prettier-config"),
  overrides: [
    {
      files: "*.html",
      options: {
        parser: "angular",
      },
    },
  ],
};
