const path = require("node:path");

/**
 * @param {string} filePath
 * @returns {boolean}
 */
module.exports = (filePath) =>
  filePath.split(path.sep).some((part) => part.startsWith("_"));
