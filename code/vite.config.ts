import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import typescript from "@rollup/plugin-typescript";
import { resolve } from "node:path";
import libCss from "vite-plugin-libcss";
export default defineConfig({
  plugins: [
    react(),
    libCss(),
    typescript({
      target: "es5",
      rootDir: resolve("src"),
      declaration: true,
      declarationDir: resolve("dist"),
      exclude: [resolve("node_modules/**")],
      allowSyntheticDefaultImports: true,
    }),
  ],
  build: {
    cssCodeSplit: true,
    lib: {
      // 入口文件将包含可以由你的包的用户导入的导出：
      entry: resolve(__dirname, "src/index.tsx"),
      name: "react-gantt-lightweight",
      fileName: (format) => `react-gantt-lightweight.${format}.js`,
    },
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: ["react", "@rollup/plugin-typescript", "tslib"],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        dir: "dist",
        globals: {
          react: "React",
        },
      },
    },
  },
});
