const path = require("node:path");

module.exports = (eleventyConfig) => {
  eleventyConfig.addFilter("relative", function (value) {
    if (!this.page.url) {
      return;
    }

    // 상대 경로는 그대로 반환
    if (!value.startsWith("/")) {
      return value;
    }

    const from = path.parse(this.page.url);
    const to = path.parse(value);
    const relativeDir = path.relative(from.dir, to.dir);
    const relativePath = path.join(relativeDir, to.base);

    return path.normalize(relativePath).split(path.sep).join("/");
  });
};
