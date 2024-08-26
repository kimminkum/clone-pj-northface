const path = require("node:path");

const BUILD_MODE = process.env.ELEVENTY_RUN_MODE === "build";
const ROOT = path.resolve(__dirname, "..");
const SRC = path.resolve(ROOT, "src");
const INCLUDES = path.resolve(SRC, "_includes");

const sass = require("sass");
const postcss = require("postcss");
const postcssrc = require("postcss-load-config");
const prettier = require("prettier");

const hasLeadingUnderscore = require("./util/has-leading-underscore.cjs");

/**
 * @param {import("@11ty/eleventy").UserConfig} eleventyConfig
 */
module.exports = (eleventyConfig) => {
  eleventyConfig.addTemplateFormats(["css", "scss"]);

  eleventyConfig.addExtension("css", {
    outputFileExtension: "css",
    compile: async function (inputContent, inputPath) {
      if (hasLeadingUnderscore(inputPath)) {
        return;
      }

      return async () => inputContent;
    },
  });
  eleventyConfig.addExtension("scss", {
    outputFileExtension: "css",
    compile: async function (inputContent, inputPath) {
      if (hasLeadingUnderscore(inputPath)) {
        return;
      }

      const { dir } = path.parse(inputPath);

      return async () => {
        const result = await sass
          .compileStringAsync(inputContent, {
            loadPaths: [dir || ".", INCLUDES],
          })
          .catch((error) => {
            throw error;
          });

        if (result && result.css) {
          return result.css;
        }

        throw new Error("Failed to compile SCSS", inputPath);
      };
    },
  });

  eleventyConfig.addTransform("postcss", async function (content) {
    const { inputPath, outputPath, outputFileExtension } = this.page;

    if (!outputPath) {
      return content;
    }

    if (outputFileExtension !== "css") {
      return content;
    }

    const filePath = path.resolve(ROOT, inputPath);
    const { plugins, options } = await postcssrc();
    const result = await postcss(plugins)
      .process(content, {
        ...options,
        from: filePath,
      })
      .then((result) => result.css);
    let css = result;

    if (BUILD_MODE) {
      return prettier.format(css, {
        parser: "css",
      });
    }

    return css;
  });
};
