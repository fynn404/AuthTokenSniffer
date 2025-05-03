# Auth Token Sniffer Chrome Extension

这是一个 Chrome 扩展，用于自动捕获浏览器请求中的 Authorization token。

## 功能特点

- 自动捕获所有网络请求中的 Authorization token
- 显示 token 的来源 URL
- 记录捕获时间
- 显示请求方法
- 美观的界面展示

## 开发步骤

1. 创建项目目录结构：
   ```
   AuthTokenSniffer/
   ├── manifest.json
   ├── background.js
   ├── popup.html
   ├── popup.js
   ├── README.md
   └── images/
       ├── icon16.png
       ├── icon48.png
       └── icon128.png
   ```

2. 创建 manifest.json 文件，定义扩展的基本信息和权限
3. 创建 background.js 文件，实现 token 捕获的核心逻辑
4. 创建 popup.html 和 popup.js 文件，实现用户界面
5. 创建图标文件（16x16、48x48、128x128 像素）
6. 在 Chrome 中加载扩展进行测试

## 打包和发布流程

### 本地打包
1. 准备打包
   - 确保所有文件都已完成开发和测试
   - 检查 manifest.json 中的版本号是否正确
   - 确保所有图标文件都存在且尺寸正确

2. 打包扩展
   - 打开 Chrome 浏览器，进入扩展管理页面 (chrome://extensions/)
   - 确保开发者模式已开启
   - 点击"打包扩展程序"按钮
   - 选择项目根目录
   - 如果是更新现有扩展，需要提供之前的私钥文件
   - 点击"打包扩展程序"

3. 打包结果
   - 会生成两个文件：
     - `.crx` 文件：已打包的扩展文件
     - `.pem` 文件：私钥文件（首次打包时生成，请安全保存）

### 发布到 Chrome 网上应用店
1. 准备材料
   - 高质量的扩展截图（至少一张，1280x800 或 640x400 像素）
   - 扩展图标（128x128 像素）
   - 详细的扩展描述
   - 隐私政策说明

2. 发布步骤
   - 访问 [Chrome 开发者控制台](https://chrome.google.com/webstore/devconsole)
   - 支付一次性开发者注册费（目前为 $5）
   - 点击"新项目"按钮
   - 上传打包好的 .crx 文件
   - 填写扩展详细信息：
     - 名称和描述
     - 详细功能说明
     - 隐私政策
     - 截图和宣传图片
   - 提交审核

3. 审核和发布
   - 等待 Google 审核（通常需要几天时间）
   - 审核通过后扩展会自动发布
   - 如果审核未通过，根据反馈修改后重新提交

### 更新扩展
1. 修改版本号
   - 在 manifest.json 中更新 "version" 字段
   - 遵循语义化版本规范（major.minor.patch）

2. 重新打包
   - 使用相同的私钥文件重新打包
   - 在开发者控制台上传新版本
   - 等待审核和发布

## 插件工作流程

1. **初始化阶段**：
   - 扩展加载时，background.js 中的 service worker 开始运行
   - 初始化 capturedTokens 数组用于存储捕获的 token

2. **请求监听阶段**：
   - 通过 chrome.webRequest.onBeforeSendHeaders 监听所有网络请求
   - 检查每个请求的 headers 中是否包含 Authorization 头
   - 如果找到 Authorization 头，提取 token 信息

3. **Token 处理阶段**：
   - 创建包含以下信息的 token 对象：
     - URL：请求的来源地址
     - Token：Authorization 头的值
     - 时间戳：捕获时间
     - 方法：HTTP 请求方法（GET、POST 等）
   - 将 token 信息添加到 capturedTokens 数组
   - 使用 chrome.storage.local 将 token 信息持久化存储

4. **用户界面交互阶段**：
   - 用户点击扩展图标时，popup.html 页面加载
   - popup.js 从 chrome.storage.local 获取存储的 token 信息
   - 将 token 信息格式化并显示在 popup 页面中

5. **数据持久化**：
   - 所有捕获的 token 都存储在浏览器的本地存储中
   - 即使浏览器关闭，token 信息也会被保留
   - 数据完全本地存储，不会发送到任何服务器

## 安装说明

1. 下载或克隆此仓库到本地
2. 打开 Chrome 浏览器，进入扩展管理页面 (chrome://extensions/)
3. 开启右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择本项目的文件夹

## 使用方法

1. 安装扩展后，点击 Chrome 工具栏中的扩展图标
2. 扩展会自动捕获所有包含 Authorization 头的请求
3. 在弹出窗口中可以查看所有捕获的 token
4. 每个 token 条目包含：
   - 请求方法
   - 来源 URL
   - token 内容
   - 捕获时间

## 注意事项

- 此扩展需要访问所有网站的权限，因为它需要监听所有网络请求
- 捕获的 token 仅存储在本地，不会发送到任何服务器
- 请谨慎使用此扩展，确保遵守相关网站的使用条款和隐私政策

## 隐私说明

本扩展不会收集或发送任何数据到外部服务器。所有捕获的 token 仅存储在本地浏览器中。