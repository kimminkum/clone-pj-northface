const directoryOutputPlugin = require("@11ty/eleventy-plugin-directory-output");
const esbuildPlugin = require("./plugins/esbuild.cjs");
const posthtmlPlugin = require("./plugins/posthtml.cjs");
const stylePlugin = require("./plugins/style.cjs");
const noIndexPermalinkPlugin = require("./plugins/no-index-permalink.cjs");
const relativePathPlugin = require("./plugins/eleventy-plugin-relative-path.cjs");

/** @param {import("@11ty/eleventy").UserConfig} eleventyConfig */
module.exports = (eleventyConfig) => {
  eleventyConfig.setQuietMode(true);

  eleventyConfig.addPlugin(relativePathPlugin);
  eleventyConfig.addPlugin(directoryOutputPlugin);
  eleventyConfig.addPlugin(esbuildPlugin);
  eleventyConfig.addPlugin(posthtmlPlugin);
  eleventyConfig.addPlugin(stylePlugin);
  eleventyConfig.addPlugin(noIndexPermalinkPlugin);

  // Layout Alias
  eleventyConfig.addLayoutAlias("default", "default.html");

  eleventyConfig.setServerOptions({
    // 기본 8080 포트 사용 불가로 오류 발생 시 3000, 3030 등 다른 포트로 변경
    // port: 3000,
    showAllHosts: true,
  });

  // 추가 처리 없이 복사할 파일들
  // See https://www.11ty.dev/docs/copy/
  const EXTs = {
    IMAGES: ["jpg", "jpeg", "png", "gif", "svg", "webp", "ico"],
    VIDEOS: ["mp4", "webm"],
    FONTS: ["woff", "woff2"],
    DATA: ["json", "xml", "webmanifest"],
    MISC: ["map"],
    toString() {
      const all = Object.entries(this).reduce((acc, [key, value]) => {
        if (Array.isArray(value)) {
          acc.push(...value);
        }

        return acc;
      }, []);
      return all.join(",");
    },
  };
  eleventyConfig.addPassthroughCopy(`src/**/*.{${EXTs}}`, {
    overwrite: true,
    filter: (path) => {
      // 경로의 모든 부분을 검사하여 '_'로 시작하는 부분이 있는지 확인
      const pathParts = path.split("/");
      return !pathParts.some((part) => part.startsWith("_"));
    },
  });

  // `--serve` 옵션으로 실행 시 실제로 파일을 복사하는대신 파일 복사를 에뮬레이션 해주는 설정이나 제대로 동작하지 않고 있음
  // https://www.11ty.dev/docs/copy/#emulate-passthrough-copy-during-serve
  // eleventyConfig.setServerPassthroughCopyBehavior("passthrough");

  return {
    dir: {
      layouts: "_layouts",
      input: "src",
      output: "dist",
    },
  };
};
