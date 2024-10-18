const fs = require("fs");
const path = require("path");
function generateRoutes(dir, basePath) {
  // 读取dir目录下的所有vue文件
  const files = fs.readdirSync(dir);
  // 筛选出所有.vue文件
  return files.flatMap((file) => {
    // 获取文件的完整路径
    const fullPath = path.resolve(dir, file);
    const relativePath = path.relative(basePath, fullPath);
    //   console.log(relativePath);
    // 判断是文件还是文件夹
    if (fs.statSync(fullPath).isDirectory()) {
      return generateRoutes(fullPath, basePath);
    }
    if (file.endsWith(".vue")) {
      const routePath = relativePath
        .replace(/\\/g, "/")
        .replace(/\.vue$/, "")
        .replace(/\/index$/, "") // 末尾是index.vue默认不加index
        .replace(/\/_/g, "/:");

      const parts = routePath.split("/").filter(Boolean);
      // 预防重复例如 User/user.vue
      if (
        parts.length > 1 &&
        parts[parts.length - 1] === parts[parts.length - 2]
      ) {
        parts.pop();
      }
      // 添加最前面的/和字母小写
      const finalPath = "/" + parts.join("/").toLowerCase();
      // 获取其他额外元数据信息
      const metaFilePath = fullPath.replace(".vue", ".meta.js");
      const meta = fs.existsSync(metaFilePath) ? require(metaFilePath) : {};
      return [
        {
          path: finalPath,
          component: fullPath,
          ...meta,
        },
      ];
    }
    return [];
  });
}

function VitePluginAutoRoutes(option = {}) {
  // 获取配置选项(文件目录，以及写入路由对象的文件路径)

  const { filePath = "src/views", routeFile = "src/router/autoRoutes.js" } =
    option;
  // 在解析 Vite 配置后调用。使用这个钩子读取和存储最终解析的配置。当插件需要根据运行的命令做一些不同的事情时，它也很有用。
  return {
    name: "vite-plugin-auto-routes",
    configResolved(config) {
      const dirPath = path.resolve(config.root, filePath);
      // 获取路由对象
      const routes = generateRoutes(dirPath, dirPath);

      console.log(routes);

      // 生成文件内容
      const data = `export const routesList = ${JSON.stringify(
        routes,
        null,
        2
      )}`;
      // 写入文件
      fs.writeFileSync(path.resolve(config.root, routeFile), data);
    },
  };
}

// exports.generateRoutes = generateRoutes;

// module.exports = { generateRoutes, VitePluginAutoRoutes };
module.exports = VitePluginAutoRoutes;
