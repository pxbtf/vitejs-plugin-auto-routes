const { generateRoutes } = require("../src/index");
const path = require("path");
const testPath = path.resolve(
  __dirname,
  "../../vite-plugin-auto-router/src/views"
);

generateRoutes(testPath, testPath);
