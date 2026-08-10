# Delov's Blog

使用 Hexo 和 [hexo-theme-mdsuper](https://github.com/tobylaifun/hexo-theme-mdsuper) 构建。

```bash
npm install
npx hexo clean
npx hexo generate
npx hexo server
```

## 部署

推送到 GitHub 后，`.github/workflows/deploy.yml` 会自动生成站点并部署到 `gh-pages` 分支。在仓库的 GitHub Pages 设置中选择 `gh-pages` 分支作为发布源即可。
