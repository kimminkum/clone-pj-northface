const path = require("node:path");

const BUILD_MODE = process.env.ELEVENTY_RUN_MODE === "build";
const ROOT = path.resolve(__dirname, "..");

const posthtml = require("posthtml");
const posthtmlPostcss = require("posthtml-postcss");
const posthtmlEsbuild = require("./posthtml-esbuild.cjs");
const prettier = require("prettier");

/**
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 */
module.exports = (eleventyConfig) => {
  eleventyConfig.addTransform("posthtml", async function (content) {
    const { inputPath, outputPath, outputFileExtension } = this.page;

    if (!outputPath) {
      return content;
    }

    if (outputFileExtension !== "html") {
      return content;
    }

    const filePath = path.resolve(ROOT, inputPath);
    const posthtmlPlugins = [posthtmlPostcss(), posthtmlEsbuild()];
    const result = await posthtml(posthtmlPlugins)
      .process(content, { from: filePath })
      .then((result) => result.html);
    let html = result;

    if (BUILD_MODE) {
      return prettier.format(html, {
        parser: "html",
      });
    }

    return html;
  });
};
