module.exports = {
  plugins: {
    "postcss-preset-env": {
      features: {
        "nesting-rules": true,
        "custom-selectors": true,
      },
    },
    "postcss-import": {
      filter(path) {
        return !path.includes("/fonts/");
      },
    },
  },
};
