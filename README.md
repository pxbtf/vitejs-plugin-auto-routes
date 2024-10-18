### 安装

```js
npm i vitejs-plugin-auto-routes
```

### 使用方式

- 在 vite.config.ts 引入该插件

```js
// vite.config.ts
import VitePluginAutoRoutes from "vitejs-plugin-auto-routes";
export default defineConfig({
  plugins: [
    xxx, //其他插件配置
    VitePluginAutoRoutes({
      filePath: "./src/views",
      routeFile: "src/router/autoRoutes.js",
    }),
  ],
});
```

- 在 src/router/index.ts 路由配置文件中引入路由对象

```js
// src/router/index.ts
import { createRouter, createWebHashHistory } from "vue-router";
import { routesList } from "./autoRoutes.js"; // 自动生成的autoRoutes.js
//  这里需要手动导入
const routes = routesList.map((route) => {
  return {
    ...route,
    component: () => import(route.component),
  };
});
const router = createRouter({
  routes: routes,
  history: createWebHashHistory(),
});

export default router;
```

- **filePath** 代表页面组件的目录 默认是 src/views
- **routeFile** 代表生成的路由对象写入的文件路径默认是"src/router/autoRoutes.js"

### 结果

当启动 vite 项目时，该插件会分析 filePath 下的所有 **.vue** 文件，会以它们的文件名称作为 router 的路径，例如

- Home.vue -> /home
- User/info.vue -> /user/info
- User/\_id.vue -> /user/:id
