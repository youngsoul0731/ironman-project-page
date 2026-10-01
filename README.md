# IronMan project page

论文 **IronMan: Information-Constrained Video-Action Learning for Robot Manipulation** 的静态项目主页。可直接发布到 GitHub Pages，无需安装依赖或构建网页。

## 页面内容

- 论文标题、作者、机构、PDF 下载和 BibTeX
- 三个首页机器人演示和四项核心结果
- 真实机器人实验：ID、Background、Layout 三组，共 18 个 IronMan 示例
- 花卉任务的 IronMan / FastWAM 示例与论文关键帧
- 方法架构、两张实验结果表、可展开的瓶颈分析与注意力图
- 四项仿真任务的 rollout / attention 对照视频
- 视频进入可见区域后加载和播放，离开或切换分组后暂停；支持统一暂停和系统减少动态效果设置
- 手机布局、键盘切换、图片原图入口、可复制和下载的引用

## 本地查看

直接打开 `index.html`，或在此文件夹中运行：

```sh
python3 -m http.server 8000
```

然后打开 `http://localhost:8000`。本地文件模式下，某些浏览器可能限制剪贴板功能；页面会自动选择引用文本供手动复制。

## 发布到 GitHub Pages

1. 在你的 GitHub 账号下新建一个用于主页的仓库，例如 `ironman`。
2. 将本文件夹里的文件放到仓库根目录。根目录应直接包含 `index.html`、`static/`、`.nojekyll` 和 `.github/`。
3. 打开仓库 **Settings → Pages → Build and deployment → Source**，选择 **GitHub Actions**。
4. 将文件提交到 `main` 分支。若提交时尚未开启 Pages，可在 **Actions → Publish project page → Run workflow** 重新运行。
5. 等待发布完成后，在 **Settings → Pages** 或对应 Actions 运行里打开发布地址。

普通项目仓库的地址通常为 `https://你的用户名.github.io/仓库名/`。页面使用相对路径，因此支持此类子目录地址；不要把素材链接改成以 `/static/` 开头的绝对路径。

发布流程只上传 `index.html`、`.nojekyll` 和 `static/`。README、源素材库和本地检查文件不会被纳入网页产物。

参考：[GitHub 官方 Pages 发布说明](https://docs.github.com/en/get-started/start-your-journey/deploying-your-website-automatically)。

## 后续更新

- 页面文字和实验表格：`index.html`
- 配色和排版：`static/css/style.css`
- 视频分组、按需播放和复制引用：`static/js/index.js`
- 图片、视频与论文：`static/images/`、`static/videos/`、`static/pdfs/`
- 引用：同时更新页面内 BibTeX 和 `static/ironman.bib`

当前使用提供的论文 PDF 核对标题、作者、机构和数据。未提供正式 arXiv 编号、作者主页和代码仓库，因此没有虚构这些链接。PDF 自身保留原文件，里面的代码仓库仍是作者提供版本中的占位地址；拿到正式版本后可替换 PDF 并添加相应按钮。

真实机器人结果是 **normalized task scores**；LIBERO / LIBERO-Plus / RoboTwin 表格是 **success rates**。视频是选取的定性示例，不代表全部试验。仿真对照中 IronMan 成功后的最后一帧会保持到基线片段结束。

## 素材与使用权

页面包含约 69 MB 的素材，其中 27 个独立视频约 56 MB；每个文件均小于 7 MB。所有实验素材和论文来自提供的文件，未添加股票素材或生成的机器人演示。论文、图片和视频的权利归其原权利人；此文件夹不额外授予素材许可。
